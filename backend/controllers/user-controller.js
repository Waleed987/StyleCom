const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const publicUser = (user) => ({
    userId: user._id.toString(),
    username: user.username,
    email: user.email,
    isAdmin: Boolean(user.isAdmin),
});

const authResponse = async (user, message) => ({
    message,
    token: await user.generateToken(),
    user: publicUser(user),
});

const registerUser = async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const email = normalizeEmail(req.body.email);
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters.' });
        }
        if (await User.exists({ email })) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const user = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 12),
            isAdmin: false,
        });

        return res.status(201).json(await authResponse(user, 'Account created successfully.'));
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Unable to create your account right now.' });
    }
};

const loginUser = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const password = req.body.password;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !password) {
            return res.status(401).json({ message: 'Email or password is incorrect.' });
        }

        const isHashed = user.password.startsWith('$2');
        const passwordMatches = isHashed
            ? await bcrypt.compare(password, user.password)
            : password === user.password;

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Email or password is incorrect.' });
        }

        // Upgrade accounts created before password hashing was added.
        if (!isHashed) {
            user.password = await bcrypt.hash(password, 12);
            await user.save();
        }

        return res.status(200).json(await authResponse(user, 'Signed in successfully.'));
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Unable to sign in right now.' });
    }
};

const googleLogin = async (req, res) => {
    try {
        const credential = req.body.credential;
        const googleClientId = process.env.GOOGLE_CLIENT_ID;

        if (!credential || !googleClientId) {
            return res.status(400).json({ message: 'Google sign-in is not configured.' });
        }

        const verification = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
        );
        const profile = await verification.json();

        if (!verification.ok || profile.aud !== googleClientId || profile.email_verified !== 'true') {
            return res.status(401).json({ message: 'Google could not verify this account.' });
        }

        const email = normalizeEmail(profile.email);
        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            user = await User.create({
                username: profile.name || email.split('@')[0],
                email,
                googleId: profile.sub,
                password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12),
                isAdmin: false,
            });
        } else if (!user.googleId) {
            user.googleId = profile.sub;
            await user.save();
        } else if (user.googleId !== profile.sub) {
            return res.status(401).json({ message: 'This email is linked to another Google account.' });
        }

        return res.status(200).json(await authResponse(user, 'Signed in with Google.'));
    } catch (error) {
        console.error('Error in Google login:', error);
        return res.status(500).json({ message: 'Unable to sign in with Google right now.' });
    }
};

module.exports = { registerUser, loginUser, googleLogin };
