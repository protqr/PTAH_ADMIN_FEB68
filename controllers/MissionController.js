import { StatusCodes } from "http-status-codes";
import Mission from "../models/MissionModel.js";
import { NotFoundError } from "../errors/customError.js";
import Submission from "../models/SubmissionModel.js";


export const getAllMissions = async (req, res) => {
  const missions = await Mission.find({})
    .populate({
      path: 'submission',
      model: 'submissions'
    }); 
  res.status(StatusCodes.OK).json({ missions });
};

export const createMission = async (req, res) => {

  const mission = await Mission.create(req.body);
  res.status(StatusCodes.CREATED).json({ mission });
};

export const getMission = async (req, res) => {
  const { id } = req.params;
  const mission = await Mission.findById(id).populate({
    path: 'submission',
    model: 'submissions'
  });
  if (!mission) throw new NotFoundError(`No mission with id: ${id}`);
  res.status(StatusCodes.OK).json({ mission });
};

export const updateMission = async (req, res) => {
  const { id } = req.params;
  const mission = await Mission.findByIdAndUpdate(id, req.body, { new: true });
  if (!mission) throw new NotFoundError(`No mission with id: ${id}`);
  res.status(StatusCodes.OK).json({ mission });
};

export const deleteMission = async (req, res) => {
  const { id } = req.params;
  const mission = await Mission.findByIdAndDelete(id);
  if (!mission) throw new NotFoundError(`No mission with id: ${id}`);
  res
    .status(StatusCodes.OK)
    .json({ msg: "Mission deleted successfully", mission });
};
export const getAllSubmissions = async (req, res) => {
    const submissions = await Submission.find({});
    res.status(StatusCodes.OK).json({ submissions });
  };

  export const createSubmission = async (req, res) => {
    const submission = await Submission.create(req.body);
    res.status(StatusCodes.CREATED).json({ submission });
  };

  export const getSubmission = async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    if (!submission) throw new NotFoundError(`No submission with id: ${id}`);
    res.status(StatusCodes.OK).json({ submission });
  };

  export const updateSubmission = async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!submission) throw new NotFoundError(`No submission with id: ${id}`);
    res.status(StatusCodes.OK).json({ submission });
  };

  export const deleteSubmission = async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findByIdAndDelete(id);
    if (!submission) throw new NotFoundError(`No submission with id: ${id}`);
    res
      .status(StatusCodes.OK)
      .json({ msg: "Submission deleted successfully", submission });
  };

export const createMissionWithSubmissions = async (req, res) => {
  const { no, name, isEvaluate, submissionsData } = req.body;
  
  try {
    // Create the submission first with the correct fields from SubmissionSchema
    const submissionToCreate = {
      name: submissionsData[0].name,
      videoUrl: submissionsData[0].videoUrl || "",
      imageUrl: submissionsData[0].imageUrl || "",
      isEvaluated: submissionsData[0].isEvaluated
    };
    
    const submission = await Submission.create(submissionToCreate);
    
    // Find the existing mission by name (postureType)
    let mission = await Mission.findOne({ name });
    
    if (!mission) {
      // If mission doesn't exist, create it
      mission = await Mission.create({
        no,
        name,
        isEvaluate,
        submission: [submission._id].toString  // Add submission ID to the array
      });
    } else {
      // If mission exists, update its submission array
      if (!mission.submission) {
        mission.submission = [];
      }
      mission.submission.push(submission._id);
      await mission.save();
    }
    
    // Return both created/updated objects with populated submission
    const populatedMission = await Mission.findById(mission._id).populate({
      path: 'submission',
      model: 'submissions'  // Explicitly specify the model name
    });
    
    res.status(StatusCodes.CREATED).json({ 
      mission: populatedMission, 
      submission 
    });
  } catch (error) {
    console.error('Error in createMissionWithSubmissions:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      msg: 'Error creating submission and updating mission',
      error: error.message 
    });
  }
};
  