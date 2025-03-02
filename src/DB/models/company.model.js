import { Schema, model } from 'mongoose';

const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfEmployees: {
        type: Number,
        required: true,
        min: [11, 'Must have at least 11 employees'],
        max: [20, 'Must have no more than 20 employees']
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logo: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    coverPic: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    HRs: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    bannedAt: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    },
    legalAttachment: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    approvedByAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// mongoose hook for cascading deletion 
companySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const companyId = this._id;

    try {
        // Delete all jobs posted by the company
        await Job.deleteMany({ companyId: companyId });

        // Delete all applications for jobs posted by the company
        await Application.deleteMany({ jobId: { $in: await Job.find({ companyId: companyId }).distinct('_id') } });

        next();
    } catch (error) {
        next(error);
    }
});

const companyModel = model('Company', companySchema);
export default companyModel;
