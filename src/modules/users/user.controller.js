import { userRouter } from "express";
import * as userService from './user.service.js';


const userRouter = userRouter();

userRouter.post("/addUser", userService.addUser);

// Update user account;
userRouter.put('/update', userService.updateUser);


// Get logged-in user data
userRouter.get('/me', userService.getLoginUser);

// Get profile data for another user
userRouter.get('/profile/:userId', userService.getProfileData);

// Update password
userRouter.put('/update-password', userService.updatePassword);

// Upload profile picture
userRouter.post('/upload-profile-pic', userService.uploadProfilePic);

// Upload cover picture
userRouter.post('/upload-cover-pic', userService.uploadCoverPic);

// Delete profile picture
userRouter.delete('/delete-profile-pic', userService.deleteProfilePic);

// Delete cover picture
userRouter.delete('/delete-cover-pic', userService.deleteCoverPic);

// Soft delete account
userRouter.delete('/soft-delete', userService.softDeleteAccount);





export default userRouter;