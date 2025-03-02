import express from 'express';
import * as authService from './auth.services.js';

const authRouter = express.Router();

// Sign Up
authRouter.post('/signup', authService.signUp);

// Confirm OTP
authRouter.post('/confirm-otp', authService.confirmOTP);

// Sign In
authRouter.post('/signin', authService.signIn);

// Sign Up with Google
authRouter.post('/signup/google', authService.signUpWithGoogle);

// Login with Google
authRouter.post('/login/google', authService.loginWithGoogle);

// Forget Password
authRouter.post('/forget-password', authService.forgetPassword);

// Reset Password
authRouter.post('/reset-password', authService.resetPassword);

// Refresh Token
authRouter.post('/refresh-token', authService.refreshToken);

export default authRouter;