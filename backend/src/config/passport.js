const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'your_github_client_id') {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email', 'repo'],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });
            if (!user) {
                user = await User.create({
                    githubId: profile.id,
                    githubUsername: profile.username,
                    githubAccessToken: accessToken,
                    name: profile.displayName || profile.username,
                    email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
                    avatar: profile.photos?.[0]?.value || '',
                });
            } else {
                user.githubAccessToken = accessToken;
                await user.save();
            }
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));
}
