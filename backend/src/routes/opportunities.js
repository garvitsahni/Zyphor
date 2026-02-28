const express = require('express');
const Opportunity = require('../models/Opportunity');
const Registration = require('../models/Registration');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all opportunities with smart filtering
router.get('/', async (req, res) => {
    try {
        const { domain, difficulty, durationStr, rewardStr, mode } = req.query;
        let query = { isPublished: true };

        if (domain) query.domain = new RegExp(domain, 'i');
        if (difficulty) query.difficulty = difficulty;
        if (mode) query.mode = mode;

        if (durationStr) {
            const maxDuration = parseInt(durationStr);
            if (!isNaN(maxDuration)) query.duration = { $lte: maxDuration };
        }

        if (rewardStr) {
            query.reward = new RegExp(rewardStr, 'i'); // Basic text matching for rewards
        }

        const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
        res.json({ opportunities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Personalized recommendations based on user skills and history
router.get('/recommendations', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const userSkills = user.skills || [];

        // Find opportunities where skills match
        // and add a "why recommended" explanation
        let opportunities = await Opportunity.find({ isPublished: true }).lean();

        opportunities = opportunities.map(opp => {
            const matchedSkills = opp.skillsRequired.filter(skill => userSkills.includes(skill));
            const matchScore = opp.skillsRequired.length ? matchedSkills.length / opp.skillsRequired.length : 1;

            let whyRecommended = '';
            if (matchedSkills.length > 0) {
                whyRecommended = `Matches your skills in ${matchedSkills.join(', ')}.`;
            } else if (opp.difficulty === 'beginner') {
                whyRecommended = 'Great starting point for beginners.';
            } else {
                whyRecommended = 'Popular in your domain.';
            }

            return { ...opp, matchScore, whyRecommended };
        });

        // Sort by match score and return top
        opportunities.sort((a, b) => b.matchScore - a.matchScore);

        res.json({ recommendations: opportunities.slice(0, 5) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ═══════════════════════════════════════════
// Decision-Assist Endpoint — Enriched data for the decision assistant UI
// ═══════════════════════════════════════════
router.get('/decision-assist', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const userSkills = (user.skills || []).map(s => s.toLowerCase());

        let opportunities = await Opportunity.find({ isPublished: true }).lean();

        // Get user's past registrations for context
        const registrations = await Registration.find({ user: req.user._id });
        const registeredIds = registrations.map(r => r.opportunity.toString());

        // Enrich each opportunity
        const enriched = opportunities.map(opp => {
            const requiredSkills = (opp.skillsRequired || []).map(s => s.toLowerCase());
            const matchedSkills = requiredSkills.filter(s => userSkills.includes(s));
            const missingSkills = requiredSkills.filter(s => !userSkills.includes(s));
            const matchScore = requiredSkills.length ? matchedSkills.length / requiredSkills.length : 1;

            // Difficulty assessment (human-readable)
            let difficulty;
            if (matchScore >= 0.9) difficulty = 'Easy win';
            else if (matchScore >= 0.7) difficulty = 'Good stretch';
            else if (matchScore >= 0.4) difficulty = 'Bit challenging';
            else difficulty = 'Real challenge';

            // Prep time estimate
            let prepTime;
            const gaps = missingSkills.length;
            if (gaps === 0) prepTime = 'Minimal';
            else if (gaps <= 2) prepTime = '3–5 hrs';
            else if (gaps <= 4) prepTime = '5–10 hrs';
            else prepTime = '10+ hrs';

            // Selection rate hint
            let selectionRate;
            if (opp.difficulty === 'beginner') selectionRate = 'High';
            else if (matchScore >= 0.8) selectionRate = 'Good';
            else if (opp.difficulty === 'intermediate') selectionRate = 'Moderate';
            else selectionRate = 'Competitive';

            // Verdict (human-readable decision recommendation)
            let verdict, verdictColor;
            if (matchScore >= 0.85) { verdict = 'Strong match'; verdictColor = '#55EFC4'; }
            else if (matchScore >= 0.6) { verdict = 'Worth applying'; verdictColor = '#00CEC9'; }
            else if (opp.difficulty === 'beginner') { verdict = 'Start here'; verdictColor = '#A29BFE'; }
            else if (matchScore >= 0.35) { verdict = 'Prepare first'; verdictColor = '#FDCB6E'; }
            else { verdict = 'Stretch goal'; verdictColor = '#FF7675'; }

            // Reassurance message (reduces decision anxiety)
            let reassurance;
            if (matchScore >= 0.85) {
                reassurance = 'You meet most requirements. This is a strong fit for your profile.';
            } else if (matchScore >= 0.6) {
                reassurance = "You won't be disqualified for the gaps — your strengths in other areas compensate.";
            } else if (opp.difficulty === 'beginner') {
                reassurance = 'This is the ideal starting point. Everyone begins somewhere.';
            } else {
                reassurance = `Students at your level usually attempt 3 before getting selected. Focus on learning from each attempt.`;
            }

            // Why this matters
            let whyMatters = '';
            if (matchedSkills.length > 0) {
                whyMatters = `Directly aligns with your experience in ${matchedSkills.slice(0, 3).join(', ')}`;
            } else if (opp.difficulty === 'beginner') {
                whyMatters = 'Perfect for building confidence with a low-stakes first competition';
            } else {
                whyMatters = `Growing field — early involvement builds unique credibility in ${opp.domain}`;
            }

            return {
                ...opp,
                matchScore,
                isRecommended: matchScore >= 0.6 || opp.difficulty === 'beginner',
                alreadyRegistered: registeredIds.includes(opp._id.toString()),
                whyMatters,
                riskReward: matchScore >= 0.7 ? 'High reward, manageable commitment' : 'Good learning opportunity',
                effort: opp.duration <= 24 ? 'Just one day' : opp.duration <= 72 ? `${Math.round(opp.duration / 24)}-day sprint` : opp.duration <= 168 ? '~1 week at your pace' : `${Math.round(opp.duration / (24 * 30))}-month commitment`,
                fit: {
                    skillsMatched: matchedSkills.length,
                    skillsTotal: requiredSkills.length || matchedSkills.length || 1,
                    missingSkills: (opp.skillsRequired || []).filter(s => !userSkills.includes(s.toLowerCase())),
                    difficulty,
                    prepTime,
                    selectionRate,
                    verdict,
                    verdictColor,
                    reassurance
                }
            };
        });

        // Sort: recommended first, then by match score
        enriched.sort((a, b) => {
            if (a.isRecommended && !b.isRecommended) return -1;
            if (!a.isRecommended && b.isRecommended) return 1;
            return b.matchScore - a.matchScore;
        });

        // Mark best pick among similar types
        const typeGroups = {};
        enriched.forEach(opp => {
            if (!typeGroups[opp.type]) typeGroups[opp.type] = [];
            typeGroups[opp.type].push(opp);
        });
        Object.values(typeGroups).forEach(group => {
            if (group.length > 1) {
                group[0].isBestPick = true;
                group[0].similarCount = group.length;
            }
        });

        res.json({ opportunities: enriched });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get opportunity by ID
router.get('/:id', async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
        res.json({ opportunity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register for an opportunity and generate checklist + readiness score
router.post('/:id/register', authMiddleware, async (req, res) => {
    try {
        const opportunityId = req.params.id;
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

        const user = await User.findById(req.user._id);

        // Check eligibility (assuming all users are eligible for now, but we check skills)
        const userSkills = user.skills || [];
        const requiredSkills = opportunity.skillsRequired || [];

        const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));

        // Calculate readiness score
        const matchedSkillsCount = requiredSkills.length - missingSkills.length;
        const readinessScore = requiredSkills.length ? Math.round((matchedSkillsCount / requiredSkills.length) * 100) : 100;

        // Generate preparation checklist
        const preparationChecklist = missingSkills.map(skill => ({
            task: `Learn basics of ${skill}`,
            resource: `Search for ${skill} tutorials on YouTube or specialized platforms.`,
            completed: false
        }));

        if (readinessScore < 100) {
            preparationChecklist.push({
                task: `Review ${opportunity.domain} domain knowledge`,
                resource: `Read recent articles on ${opportunity.domain} trends.`,
                completed: false
            });
        }

        preparationChecklist.push({
            task: `Familiarize with ${opportunity.mode} event format`,
            resource: 'Review the event rules and schedule.',
            completed: false
        });

        // Create registration
        const registration = new Registration({
            user: user._id,
            opportunity: opportunity._id,
            readinessScore,
            missingSkills,
            preparationChecklist
        });

        await registration.save();
        res.json({ registration, message: 'Successfully registered for opportunity.' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key
            return res.status(400).json({ error: 'You are already registered for this opportunity.' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Save an opportunity
router.post('/:id/save', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const opportunityId = req.params.id;

        if (!user.savedOpportunities.includes(opportunityId)) {
            user.savedOpportunities.push(opportunityId);
            await user.save();
        }

        res.json({ message: 'Opportunity saved successfully.', savedOpportunities: user.savedOpportunities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unsave an opportunity
router.post('/:id/unsave', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const opportunityId = req.params.id;

        user.savedOpportunities = user.savedOpportunities.filter(id => id.toString() !== opportunityId);
        await user.save();

        res.json({ message: 'Opportunity removed from saved list.', savedOpportunities: user.savedOpportunities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's registrations
router.get('/user/registrations', authMiddleware, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user._id }).populate('opportunity');
        res.json({ registrations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
