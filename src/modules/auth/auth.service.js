import userModel from '../../models/user.model.js';
import { sendOTP } from '../../utils/sendEmail.event.js';
import { asyncHandler } from '../../utils/errorHandling.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

export const signUp = asyncHandler(async (req, res) => {
    const { email, password, mobileNumber } = req.body;

    // Check email if exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate OTP to send 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await sendOTP(email, otp); // Send OTP thru email

    // Save the user with hashed OTP
    const user = new userModel({
        email,
        password,
        mobileNumber,
        OTP: [{ code: hashedOTP, type: 'confirmEmail', expiresIn: Date.now() + 10 * 60 * 1000 }], // OTP expires after 10 minutes
    });

    await user.save();
    res.status(201).json({ message: 'OTP sent for email verification' });
});

export const confirmOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    const otpData = user.OTP.find((o) => o.type === 'confirmEmail');
    if (!otpData || otpData.expiresIn < Date.now()) {
        return res.status(400).json({ message: 'OTP expired or invalid!' });
    }

    const isMatch = await bcrypt.compare(otp, otpData.code);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid OTP!' });
    }

    // Confirm email
    user.isConfirmed = true;
    user.OTP = user.OTP.filter((o) => o.type !== 'confirmEmail'); // Remove used OTP
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully!' });
});

export const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ accessToken, refreshToken });
});


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const signUpWithGoogle = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await userModel.findOne({ email });
    if (!user) {
        user = new userModel({
            email,
            firstName: name,
            provider: 'google',
            isConfirmed: true,
        });
        await user.save();
    }

    res.status(200).json({ message: 'Signed up with Google successfully', user });
});

export const loginWithGoogle = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = payload;
    const payload = ticket.getPayload();

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ accessToken, refreshToken });
});

export const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await sendOTP(email, otp); // Send OTP via email

    user.OTP.push({ code: hashedOTP, type: 'forgetPassword', expiresIn: Date.now() + 10 * 60 * 1000 }); // OTP expires in 10 minutes
    await user.save();

    res.status(200).json({ message: 'OTP sent for password reset!' });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const otpData = user.OTP.find((o) => o.type === 'forgetPassword');
    if (!otpData || otpData.expiresIn < Date.now()) {
        return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    const isMatch = await bcrypt.compare(otp, otpData.code);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Reset password
    user.password = newPassword;
    user.OTP = user.OTP.filter((o) => o.type !== 'forgetPassword'); // Remove used OTP
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    // Check if credentials have changed
    if (user.changeCredentialTime && decoded.iat < user.changeCredentialTime.getTime() / 1000) {
        return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    // Generate new access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ accessToken });
});