import companyModel from '../../DB/models/company.model.js';
import { asyncHandler } from '../../utils/errorHandling.js';
import cloudinary from '../../utils/cloudinary.js';


export const addCompany = asyncHandler(async (req, res) => {
    const { companyName, companyEmail } = req.body;

    // Check if company email or name already exists
    const existingCompany = await companyModel.findOne({
        $or: [{ companyName }, { companyEmail }],
    });
    if (existingCompany) {
        return res.status(400).json({ message: 'Company email or name already exists!' });
    }

    // Save the company
    const company = new companyModel(req.body);
    await company.save();

    res.status(201).json({ message: 'Company added successfully!', company });
});

export const updateCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const { legalAttachment, ...updateData } = req.body;
    const userId = req.user.id;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }

    // Check if the user is the company owner
    if (company.createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'Only the company owner can update the data' });
    }

    // Update the company data (excluding legalAttachment)
    Object.assign(company, updateData);
    await company.save();

    res.status(200).json({ message: 'Company updated successfully', company });
});


export const softDeleteCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: 'Company not found!' });
    }

    // Check if the user is the company owner or an admin
    if (company.createdBy.toString() !== userId && userRole !== 'Admin') {
        return res.status(403).json({ message: 'Only the company owner or admin can delete the company!' });
    }

    // Soft delete the company
    company.deletedAt = Date.now();
    await company.save();

    res.status(200).json({ message: 'Company soft deleted successfully!' });
});

export const getCompanyWithJobs = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    // Find the company and populate related jobs
    const company = await companyModel.findById(companyId).populate('jobs');
    if (!company) {
        return res.status(404).json({ message: 'Company not found!' });
    }

    res.status(200).json({ company });
});

export const searchCompanyByName = asyncHandler(async (req, res) => {
    const { name } = req.query;

    // Search for companies by name (case-insensitive)
    const companies = await companyModel.find({
        companyName: { $regex: name, $options: 'i' },
    });

    res.status(200).json({ companies });
});


export const uploadCompanyLogo = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: 'Company not found!' });
    }

    // Upload logo to Cloudinary
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        company.logo = {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
        await company.save();
    }

    res.status(200).json({ message: 'Company logo uploaded successfully!', company });
});

export const uploadCompanyCoverImg = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: 'Company not found!' });
    }

    // Upload cover pic to Cloudinary
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        company.coverPic = {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
        await company.save();
    }

    res.status(200).json({ message: 'Company cover picture uploaded successfully!', company });
});

export const deleteCompanyLogo = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: 'Company not found!' });
    }

    // Delete logo from Cloudinary
    if (company.logo.public_id) {
        await cloudinary.uploader.destroy(company.logo.public_id);
        company.logo = { secure_url: null, public_id: null };
        await company.save();
    }

    res.status(200).json({ message: 'Company logo deleted successfully!', company });
});

export const deleteCompanyCoverImg = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: 'Company not found!' });
    }

    // Delete cover pic from Cloudinary
    if (company.coverPic.public_id) {
        await cloudinary.uploader.destroy(company.coverPic.public_id);
        company.coverPic = { secure_url: null, public_id: null };
        await company.save();
    }

    res.status(200).json({ message: 'Company cover picture deleted successfully!', company });
});