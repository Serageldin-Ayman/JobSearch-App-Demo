import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: { type: String, enum: ['google', 'system'], default: 'system' },
    gender: { type: String, enum: ['Male', 'Female'] },
    DOB: { type: Date, required: true },
    mobileNumber: { type: String },
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
    isConfirmed: { type: Boolean, default: false },
    deletedAt: { type: Date },
    bannedAt: { type: Date },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    changeCredentialTime: { type: Date },
    profilePic: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    OTP: [{
        code: { type: String, required: true },
        type: {
            type: String,
            required: true,
            enum: ['confirmEmail', 'forgetPassword']
        },
        expiresIn: {
            type: Date,
            required: true
        }
    }],
});

// Hash password & encrypt mobile number before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    if (this.isModified('mobileNumber')) {
        const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
        let encrypted = cipher.update(this.mobileNumber, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        this.mobileNumber = encrypted;
    }
    next();
});


// Virtual field for username
userSchema.virtual('username').get(function () {
    return `${this.firstName} ${this.lastName}`;
});


userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const userId = this._id;

    try {
        // Delete all jobs posted by the user
        await Job.deleteMany({ postedBy: userId });

        // Delete all applications submitted by the user
        await Application.deleteMany({ applicantId: userId });

        next();
    } catch (error) {
        next(error);
    }
});

const userModel = model('User', userSchema);

export default userModel;