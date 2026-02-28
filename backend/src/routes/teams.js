const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new team
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, opportunityId, maxSize, requiredSkills } = req.body;

        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

        const team = new Team({
            name,
            opportunity: opportunityId,
            maxSize,
            requiredSkills,
            members: [{ user: req.user._id, role: 'leader' }]
        });

        // Auto-create team workspace (project)
        const project = new Project({
            title: `${name} Workspace`,
            owner: req.user._id,
            collaborators: [{ user: req.user._id, role: 'owner' }],
            status: 'idea',
            hackathonMode: opportunity.type === 'hackathon',
            hackathonDuration: opportunity.duration
        });

        await project.save();
        team.project = project._id;
        await team.save();

        res.status(201).json({ team, project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get team by id
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('members.user', 'name avatar skills')
            .populate('project', 'title');

        if (!team) return res.status(404).json({ error: 'Team not found' });
        res.json({ team });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Join a team
router.post('/:id/join', authMiddleware, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ error: 'Team not found' });

        if (team.members.length >= team.maxSize) {
            return res.status(400).json({ error: 'Team is full' });
        }

        const isMember = team.members.some(m => m.user.toString() === req.user._id.toString());
        if (isMember) return res.status(400).json({ error: 'You are already a member' });

        team.members.push({ user: req.user._id, role: 'member' });
        if (team.members.length >= team.maxSize) team.isLookingForMembers = false;

        await team.save();

        // Also add to project
        if (team.project) {
            const project = await Project.findById(team.project);
            if (project) {
                project.collaborators.push({ user: req.user._id, role: 'member' });
                await project.save();
            }
        }

        res.json({ team, message: 'Successfully joined the team' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI Team Matchmaking
// Returns compatible teammates based on complementary skills, timezone, work pattern
router.post('/matchmaking/users', authMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const { opportunityId } = req.body;

        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

        // Find users registered for this opportunity? For now we just search all users
        const allUsers = await User.find({ _id: { $ne: currentUser._id } }).lean();

        const matches = allUsers.map(u => {
            let score = 0;
            const reasons = [];

            // Complementary Skills:
            // High score if they have skills required by opportunity that current user lacks
            const myMissingSkills = opportunity.skillsRequired.filter(s => !currentUser.skills.includes(s));
            const partnerHasMissing = myMissingSkills.filter(s => u.skills?.includes(s));
            if (partnerHasMissing.length > 0) {
                score += 50 * (partnerHasMissing.length / myMissingSkills.length);
                reasons.push('Complementary Skills');
            } else if (u.skills?.some(s => opportunity.skillsRequired.includes(s))) {
                score += 20;
                reasons.push('Relevant Domain Skills');
            }

            // Timezone Match
            if (u.timezone === currentUser.timezone) {
                score += 15;
                reasons.push('Same Timezone');
            }

            // Working Pattern
            if (u.workingPattern === currentUser.workingPattern) {
                score += 20;
                reasons.push('Similar Working Pattern');
            }

            // Activity Level
            if (u.activityLevel === currentUser.activityLevel) {
                score += 15;
                reasons.push('Similar Activity Level');
            }

            return {
                user: { _id: u._id, name: u.name, avatar: u.avatar, skills: u.skills, bio: u.bio },
                compatibilityScore: Math.min(100, Math.round(score)),
                reasons
            };
        });

        // Filter out zero scores and sort heavily compatible
        const topMatches = matches.filter(m => m.compatibilityScore > 30).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

        res.json({ matches: topMatches.slice(0, 5) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
