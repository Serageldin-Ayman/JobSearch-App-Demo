import jobModel from '../../DB/models/job.model.js';
import { asyncHandler } from '../../utils/errorHandling.js';
import { sendEmail } from '../../utils/sendEmail.event.js';

export const addJob = asyncHandler(async (req, res, next) => {
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy,
        updatedBy,
        closed,
        companyId
    } = req.body;

    //the job data object
    const jobData = {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy,
        updatedBy,
        closed,
        companyId
    };

    // Create a new Job Opportunity document in the database
    const newJob = await jobModel.create(jobData);

    return res.status(201).json({
        message: "Job created successfully!",
        data: newJob
    });
});

export const updateJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Find the job
    const job = await jobModel.findById(jobId);
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user is the job owner
    if (job.createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'Only the job owner can update the job' });
    }

    // Update the job data
    Object.assign(job, req.body);
    await job.save();

    res.status(200).json({ message: 'Job updated successfully', job });
});

export const deleteJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Find the job
    const job = await jobModel.findById(jobId);
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    // Find the company
    const company = await companyModel.findById(job.company);
    if (!company || !company.HRs.includes(userId)) {
        return res.status(403).json({ message: 'Only the company HR can delete the job' });
    }

    // Delete the job
    await job.remove();

    res.status(200).json({ message: 'Job deleted successfully' });
});


export const getJobs = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt', search } = req.query;

    const query = { company: companyId };
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const jobs = await jobModel
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('company', 'companyName');

    const totalCount = await jobModel.countDocuments(query);

    res.status(200).json({ jobs, totalCount });
});


export const getJobsWithFilters = asyncHandler(async (req, res) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = {};
    if (workingTime) query.workingTime = workingTime;
    if (jobLocation) query.location = jobLocation;
    if (seniorityLevel) query.seniorityLevel = seniorityLevel;
    if (jobTitle) query.title = { $regex: jobTitle, $options: 'i' };
    if (technicalSkills) query.technicalSkills = { $in: technicalSkills.split(',') };

    const jobs = await jobModel
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('company', 'companyName');

    const totalCount = await jobModel.countDocuments(query);

    res.status(200).json({ jobs, totalCount });
});


export const getApplicationsForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const job = await jobModel.findById(jobId).populate({
        path: 'applications',
        populate: {
            path: 'user',
            select: 'firstName lastName email profilePic',
        },
        options: {
            sort,
            skip: (page - 1) * limit,
            limit,
        },
    });

    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    const totalCount = job.applications.length;

    res.status(200).json({ applications: job.applications, totalCount });
});

export const acceptOrRejectApplicant = asyncHandler(async (req, res) => {
    const { jobId, applicationId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const userId = req.user.id;

    // Find the job
    const job = await jobModel.findById(jobId);
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    // Find the application
    const application = job.applications.id(applicationId);
    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the user is the HR
    const company = await companyModel.findById(job.company);
    if (!company || !company.HRs.includes(userId)) {
        return res.status(403).json({ message: 'Only the HR can accept or reject applicants' });
    }

    // Update the application status
    application.status = status;
    await job.save();

    // Send email to the applicant
    const user = await userModel.findById(application.user);
    const emailSubject = status === 'accepted' ? 'Job Application Accepted' : 'Job Application Rejected';
    const emailText = status === 'accepted'
        ? 'Congratulations! Your application has been accepted.'
        : 'We regret to inform you that your application has been rejected.';

    await sendEmail(user.email, emailSubject, emailText);

    res.status(200).json({ message: `Application ${status} successfully` });
});