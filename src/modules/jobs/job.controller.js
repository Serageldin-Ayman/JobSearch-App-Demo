import { Router } from "express";
import * as jobService from './jobs.services.js';
import { validateAddJob } from './jobs.validate.js';
const jobRouter = Router();


jobRouter.post('/addJob', validateAddJob, jobService.addJob);


jobRouter.put('/:jobId/update', jobService.updateJob);

// Delete Job
jobRouter.delete('/:jobId/delete', jobService.deleteJob);

// Get all Jobs or a specific one for a specific company
jobRouter.get('/:companyId/jobs', jobService.getJobs);

// Get all Jobs with filters
jobRouter.get('/jobs/filter', jobService.getJobsWithFilters);

// Get all applications for a specific Job
jobRouter.get('/:jobId/applications', jobService.getApplicationsForJob);

// Apply to Job (Job application)
jobRouter.post('/:jobId/apply', jobService.applyToJob);

// Accept or Reject an Applicant
jobRouter.patch('/:jobId/applications/:applicationId/status', jobService.acceptOrRejectApplicant);



export default jobRouter;
