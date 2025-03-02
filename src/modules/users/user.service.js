import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';



export const addUser = asyncHandler(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        provider,
        gender,
        DOB,
        mobileNumber,
        role,
        isConfirmed,
        deletedAt,
        bannedAt,
        updatedBy,
        changeCredentialTime,
        profilePic,
        coverPic,
        OTP
    } = req.body;

    // Build user data, ensuring required fields are provided
    const userData = {
        firstName,
        lastName,
        email,
        password,
        provider: provider || "system",
        gender,
        DOB: new Date(DOB),
        mobileNumber,
        role: role || "User",
        isConfirmed,
        deletedAt,
        bannedAt,
        updatedBy,
        changeCredentialTime,
        profilePic,
        coverPic,
        OTP
    };

    // Create a newUser document in the database
    const newUser = await userModel.create(userData);

    // Respond with the newly created user data
    return res.status(201).json({
        message: "User created successfully!",
        data: newUser
    });
}
);

export const updateUser = asyncHandler(async (req, res) => {
    const { mobileNumber, DOB, firstName, lastName, gender } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (mobileNumber) {
        const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
        let encrypted = cipher.update(mobileNumber, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        user.mobileNumber = encrypted;
    }

    if (DOB) user.DOB = DOB;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
});

// Get logged-in user data
export const getLoginUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Decrypt mobile number
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(user.mobileNumber, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const userData = {
        ...user.toObject(),
        mobileNumber: decrypted,
    };

    res.status(200).json({ user: userData });
});

// Get profile data for another user
export const getProfileData = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Decrypt mobile number
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(user.mobileNumber, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const profileData = {
        userName: `${user.firstName} ${user.lastName}`,
        mobileNumber: decrypted,
        profilePic: user.profilePic,
        coverPic: user.coverPic,
    };

    res.status(200).json({ profileData });
});

// Update password
export const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid old password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.changeCredentialTime = Date.now();
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
});

// Upload profile picture
export const uploadProfilePic = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        user.profilePic = {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
        await user.save();
    }

    res.status(200).json({ message: 'Profile picture uploaded successfully', user });
});

// Upload cover picture
export const uploadCoverPic = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        user.coverPic = {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
        await user.save();
    }

    res.status(200).json({ message: 'Cover picture uploaded successfully', user });
});

// Delete profile picture
export const deleteProfilePic = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.profilePic.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
        user.profilePic = { secure_url: null, public_id: null };
        await user.save();
    }

    res.status(200).json({ message: 'Profile picture deleted successfully', user });
});

// Delete cover picture
export const deleteCoverPic = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.coverPic.public_id) {
        await cloudinary.uploader.destroy(user.coverPic.public_id);
        user.coverPic = { secure_url: null, public_id: null };
        await user.save();
    }

    res.status(200).json({ message: 'Cover picture deleted successfully', user });
});

// Soft delete account
export const softDeleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.deletedAt = Date.now();
    await user.save();

    res.status(200).json({ message: 'Account soft deleted successfully' });
});