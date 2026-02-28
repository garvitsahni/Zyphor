const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { Activity } = require('../models/Activity');
const authMiddleware = require('../middleware/auth');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Utility to generate JSON from Gemini safely
async function generateJSON(prompt, fallbackData) {
    if (!genAI) {
        console.warn('GEMINI_API_KEY not found. Using fallback mock data.');
        return fallbackData;
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text);
    } catch (e) {
        console.error('Gemini AI Generation failed, falling back:', e);
        return fallbackData;
    }
}

// MODULE 1: Idea Validator & Research Intelligence
router.post('/validate', authMiddleware, async (req, res) => {
    try {
        const { projectId, problemStatement, solution, domain, targetUsers } = req.body;

        const fallbackData = {
            innovationScore: Math.floor(Math.random() * 30) + 70,
            similarProjects: [
                { name: 'ProjectAlpha', similarity: Math.floor(Math.random() * 30) + 10, url: 'https://github.com/example/alpha' },
                { name: 'HackBeta', similarity: Math.floor(Math.random() * 20) + 5, url: 'https://github.com/example/beta' }
            ],
            researchPapers: [
                {
                    title: `Recent Advancements in ${domain} Automation`,
                    summary: `This paper explores how applying machine learning paradigms to ${domain} significantly improves throughput by 40%.`,
                    methodology: 'Used a federated learning approach to train models on decentralized data sources without comprising privacy.',
                    datasets: ['OpenAI WebText', 'Kaggle Global Analytics'],
                    limitations: 'High computational cost and latency in edge devices.',
                }
            ],
            considerations: {
                noveltyGap: `While similar solutions exist, none effectively combine ${domain} processing with immediate feedback loops for ${targetUsers}. Your solution introduces a unique real-time element.`,
                beginnerExplanation: `Imagine if your phone could predict what app you want next based on where you are. Your idea does that, but for ${domain}, saving time and frustration.`,
                technicalExplanation: `Your architecture fundamentally relies on an event-driven microservices pattern with predictive caching for ${domain} data streams, achieving lower latency access for ${targetUsers}.`,
            },
            suggestions: [
                'Consider adding real-time collaboration features to differentiate',
                'Focus on the unique value proposition for your target demographic'
            ],
            improvedProblemStatement: `${problemStatement} — Enhanced: This addresses a critical gap in ${domain} by providing ${targetUsers} with an intelligent, automated solution.`
        };

        const prompt = `You are an expert tech startup evaluator and researcher.
Given the following project details, validate the idea.
Problem: ${problemStatement}
Solution: ${solution}
Domain: ${domain}
Target Users: ${targetUsers}

Return ONLY a JSON object with this exact structure:
{
  "innovationScore": integer (0 to 100, be realistic),
  "similarProjects": [ {"name":"string", "similarity": integer (0 to 100), "url":"string (mocked github repo)"} ],
  "researchPapers": [ {"title":"string", "summary":"string", "methodology":"string", "datasets":["string"], "limitations":"string"} ],
  "considerations": { "noveltyGap":"string", "beginnerExplanation":"string", "technicalExplanation":"string" },
  "suggestions": ["string"],
  "improvedProblemStatement": "string"
}
Output accurate, realistic, and highly insightful data based on actual tech industry trends.`;

        const generatedData = await generateJSON(prompt, fallbackData);
        generatedData.validatedAt = new Date();

        if (projectId) {
            await Project.findByIdAndUpdate(projectId, { ideaValidation: generatedData });
            await Activity.create({
                project: projectId, user: req.user._id,
                type: 'idea_validated',
                message: `validated idea and gathered research intelligence (score ${generatedData.innovationScore}/100)`,
            });
        }

        res.json({ validation: generatedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MODULE 2: Team & Roadmap Generator
router.post('/roadmap', authMiddleware, async (req, res) => {
    try {
        const { projectId, skills, teamSize, hackathonDuration, projectTitle } = req.body;

        const fallbackData = {
            roles: ['Frontend Developer', 'Backend Developer', 'ML Engineer'].slice(0, teamSize || 3),
            phases: [
                { phase: 'Setup & Architecture', hours: Math.ceil((hackathonDuration || 48) * 0.1), tasks: ['Set up repository', 'Define architecture'] },
                { phase: 'Core Development', hours: Math.ceil((hackathonDuration || 48) * 0.4), tasks: ['Build backend APIs', 'Implement core features'] }
            ]
        };

        const prompt = `You are a technical project manager organizing a hackathon.
Project Title: ${projectTitle || 'Software Application'}
Available Skills: ${skills?.join(', ') || 'General Dev'}
Team Size: ${teamSize || 3}
Hackathon Duration: ${hackathonDuration || 48} hours

Output ONLY a JSON object with this exact structure:
{
  "roles": ["string (suggested roles)"],
  "phases": [
    {
       "phase": "string phase name",
       "hours": integer (estimated hours),
       "tasks": ["string (actionable task item)"]
    }
  ]
}
Distribute the hours to roughly equal the totally hackathon duration. Provide multiple phases from setup to polish.`;

        const generatedData = await generateJSON(prompt, fallbackData);

        // Generate tasks in DB
        if (projectId && generatedData.phases) {
            let order = 0;
            for (const phase of generatedData.phases) {
                for (const taskTitle of phase.tasks) {
                    await Task.create({
                        title: taskTitle,
                        description: `Part of ${phase.phase} phase`,
                        project: projectId,
                        status: 'todo',
                        priority: phase.phase.includes('Core') || phase.phase.includes('Development') ? 'high' : 'medium',
                        estimatedHours: Math.ceil(phase.hours / phase.tasks.length),
                        tags: [phase.phase],
                        order: order++,
                    });
                }
            }
            const totalTasks = generatedData.phases.reduce((a, p) => a + p.tasks.length, 0);
            await Activity.create({
                project: projectId, user: req.user._id,
                type: 'task_created',
                message: `generated roadmap with ${totalTasks} tasks using AI`,
            });
            generatedData.totalTasks = totalTasks;
        }

        res.json({ roadmap: generatedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MODULE 3: Smart Deadline Predictor
router.post('/deadline', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.body;
        const tasks = await Task.find({ project: projectId });
        const total = tasks.length || 1;
        const done = tasks.filter(t => t.status === 'done').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;

        const completionProbability = Math.min(100, Math.round((done / total) * 100 + (inProgress / total) * 20));
        let riskLevel = 'low';
        if (completionProbability < 30) riskLevel = 'critical';
        else if (completionProbability < 50) riskLevel = 'high';
        else if (completionProbability < 75) riskLevel = 'medium';

        const fallbackData = {
            recommendedScope: riskLevel === 'critical'
                ? 'Cut non-essential features. Focus on MVP with core functionality only.'
                : 'Good progress! Continue current pace.'
        };

        const prompt = `You are an agile project manager tracking a time-sensitive hackathon project.
Metrics: Total tasks: ${total}, Completed: ${done}, In Progress: ${inProgress}.
Calculated completion probability: ${completionProbability}%. Risk level: ${riskLevel}.

Return ONLY a JSON object:
{
  "recommendedScope": "A single sentence of specific, actionable advice on what the team should focus on right now given their risk level."
}`;

        const generatedData = await generateJSON(prompt, fallbackData);

        const prediction = { completionProbability, riskLevel, recommendedScope: generatedData.recommendedScope };

        if (projectId) {
            await Project.findByIdAndUpdate(projectId, { deadline: prediction });
        }

        res.json({ prediction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MODULE 4: Judge Simulator
router.post('/judge', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const fallbackData = {
            innovation: Math.floor(Math.random() * 3) + 7,
            technicalComplexity: Math.floor(Math.random() * 3) + 7,
            feasibility: Math.floor(Math.random() * 3) + 7,
            realWorldImpact: Math.floor(Math.random() * 3) + 7,
            presentationClarity: Math.floor(Math.random() * 3) + 7,
            feedback: `Strong project concept in ${project.domain || 'technology'}. Consider improving presentation flow.`,
            improvements: ['Add quantitative metrics to demonstrate impact', 'Show user testing data']
        };

        const prompt = `You are a tough but fair Hackathon Judge. Evaluate this project:
Title: ${project.title || 'Untitled'}
Problem: ${project.problemStatement || 'Not defined'}
Solution: ${project.solution || 'Not defined'}
Domain: ${project.domain || 'Not defined'}

Score the project (1-10) and provide realistic, critical feedback.
Output ONLY JSON matching this structure:
{
  "innovation": int,
  "technicalComplexity": int,
  "feasibility": int,
  "realWorldImpact": int,
  "presentationClarity": int,
  "feedback": "string (1-2 sentences)",
  "improvements": ["string", "string"]
}`;

        const generatedData = await generateJSON(prompt, fallbackData);

        const totalScore = Math.round(
            (generatedData.innovation + generatedData.technicalComplexity +
                generatedData.feasibility + generatedData.realWorldImpact +
                generatedData.presentationClarity) / 5 * 10
        );

        const judgeResult = { ...generatedData, totalScore, scoredAt: new Date() };

        await Project.findByIdAndUpdate(projectId, { judgeScores: judgeResult });
        await Activity.create({
            project: projectId, user: req.user._id,
            type: 'judge_scored',
            message: `simulated AI judge scoring: ${totalScore}/100`,
        });

        res.json({ judgeResult });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MODULE 5: Presentation Generator
router.post('/presentation', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const fallbackData = {
            slides: [
                { title: 'The Problem', content: project.problemStatement || 'A critical challenge facing modern users...', notes: 'Open with a compelling story' },
                { title: 'Our Solution', content: project.solution || 'An intelligent platform that...', notes: 'Show the demo here' }
            ],
            speakingScript: `Good morning judges! ${project.title} is our solution to...`,
            demoFlow: [{ step: 'Login', description: 'Show auth flow' }],
            judgeQuestions: [{ question: 'How is this different?', answer: 'Our unique approach...' }]
        };

        const prompt = `Act as an expert startup pitch coach.
Project: ${project.title || 'Untitled'}
Problem: ${project.problemStatement || 'Not defined'}
Solution: ${project.solution || 'Not defined'}

Generate a winning presentation plan. Output ONLY JSON:
{
  "slides": [ {"title": "string", "content": "string (bullet points)", "notes": "string (speaker notes)"} ],
  "speakingScript": "string (2-3 paragraphs of an active, engaging pitch script)",
  "demoFlow": [ {"step": "string", "description": "string"} ],
  "judgeQuestions": [ {"question": "string (anticipated hard question)", "answer": "string (excellent response)"} ]
}`;

        const generatedData = await generateJSON(prompt, fallbackData);
        generatedData.generatedAt = new Date();

        await Project.findByIdAndUpdate(projectId, { presentation: generatedData });
        await Activity.create({
            project: projectId, user: req.user._id,
            type: 'presentation_generated',
            message: 'generated AI presentation slides and pitch',
        });

        res.json({ presentation: generatedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MODULE 6: Startup Converter
router.post('/startup', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const fallbackData = {
            businessModel: 'SaaS B2B/B2C hybrid model...',
            targetCustomers: 'Primary: Technical professionals...',
            pricing: 'Freemium → Pro ($29/mo)...',
            scalingRoadmap: 'Phase 1 MVP...',
            futureFeatures: '1. Advanced AI...'
        };

        const prompt = `You are a top-tier Venture Capitalist and Startup Strategist.
Turn this hackathon project into a real startup business plan.
Project: ${project.title || 'Untitled'}
Domain: ${project.domain || 'Tech'}
Target Users: ${project.targetUsers || 'General Public'}
Solution: ${project.solution || 'A software platform'}

Output ONLY JSON:
{
  "businessModel": "string (detailed monetization strategy)",
  "targetCustomers": "string (personas, TAM/SAM/SOM estimates)",
  "pricing": "string (pricing tiers)",
  "scalingRoadmap": "string (month 1-24 breakdown)",
  "futureFeatures": "string (top 3 long term features)"
}`;

        const generatedData = await generateJSON(prompt, fallbackData);
        generatedData.generatedAt = new Date();

        await Project.findByIdAndUpdate(projectId, { startup: generatedData });
        await Activity.create({
            project: projectId, user: req.user._id,
            type: 'startup_plan_generated',
            message: 'generated AI startup business plan',
        });

        res.json({ startup: generatedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI Assistant context-aware chat
router.post('/assistant', authMiddleware, async (req, res) => {
    try {
        const { projectId, message, context } = req.body;

        const fallbackData = { response: `I understand you're asking about "${message}". As a fallback AI, I recommend reviewing your task priorities.` };

        const prompt = `You are Zyphra, an AI Project Lifecycle Teammate assisting a user.
Context Level: ${context || 'General Work'}
User Query: "${message}"

Keep the response brief, actionable, and formatted as a direct reply (not standard JSON, but wrapped in JSON). 
Output ONLY JSON matching:
{
  "response": "string (your helpful response, markdown supported)"
}`;

        const generatedData = await generateJSON(prompt, fallbackData);

        res.json({ response: generatedData.response, context: context || 'workspace' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
