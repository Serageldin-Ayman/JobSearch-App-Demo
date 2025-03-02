import { Router } from "express";
import * as companyService from './company.service.js';
import { validateAddCompany } from './company.validate.js';

const companyRouter = Router();

companyRouter.post('/add', companyService.addCompany);

// Update company data
companyRouter.put('/update/:companyId', companyService.updateCompany);

// Soft delete company
companyRouter.delete('/soft-delete/:companyId', companyService.softDeleteCompany);

// Get specific company with related jobs
companyRouter.get('/:companyId/jobs', companyService.getCompanyWithJobs);

// Search for a company by name
companyRouter.get('/search', companyService.searchCompanyByName);

// Upload company logo
companyRouter.post('/:companyId/upload-logo', companyService.uploadCompanyLogo);

// Upload company cover picture
companyRouter.post('/:companyId/upload-cover-pic', companyService.uploadCompanyCoverImg);

// Delete company logo
companyRouter.delete('/:companyId/delete-logo', companyService.deleteCompanyLogo);

// Delete company cover picture
companyRouter.delete('/:companyId/delete-cover-pic', companyService.deleteCompanyCoverImg);



export default companyRouter;
