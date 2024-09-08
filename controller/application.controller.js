import {
  errorHandler,
  responseHandler,
} from "../middlewares/responseHandler.js";
import Application from "../models/Application.model.js";
import Job from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return responseHandler(res, 404, "Job id is required", false);
    }

    // check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId,
    });
    if (existingApplication) {
      return responseHandler(
        res,
        400,
        "You have already applied for this job",
        false
      );
    }

    // check if the jobs exists
    const job = await Job.findById(jobId);
    if (!job) {
      return responseHandler(res, 404, "Job not found", false);
    }

    // create a new application
    const newApplication = await Application.create({
      applicant: userId,
      job: jobId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    return responseHandler(res, 201, "Job applied successfully", true);
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!application) {
      return responseHandler(res, 404, "Application not found", false);
    }

    return responseHandler(res, 200, "Application fetched successfully", true, {
      application,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

// admin will see how may applicants is applied
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return responseHandler(res, 404, "Job not found", false);
    }

    return responseHandler(res, 200, "Applicants fetched successfully", true, {
      job,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return responseHandler(res, 400, "Status is required", false);
    }

    // find the application by application id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return responseHandler(res, 404, "Application not found", false);
    }

    // update the application status
    application.status = status.toLowerCase();
    await application.save();
    return responseHandler(
      res,
      200,
      "Application status updated successfully",
      true
    );
  } catch (error) {
    console.log(error);
    return errorHandler(res, error);
  }
};
