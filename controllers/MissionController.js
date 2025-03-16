import { StatusCodes } from "http-status-codes";
import Mission from "../models/MissionModel.js";
import { NotFoundError } from "../errors/customError.js";
import Submission from "../models/SubmissionModel.js";
import MissionModel from "../models/MissionModel.js";

export const getAllMissions = async (req, res) => {
  const missions = await Mission.find({ isDeleted: { $ne: true } })
    .populate({
      path: 'submission',
      model: 'submissions'
    });
  res.status(StatusCodes.OK).json({ missions });
};

export const createMission = async (req, res) => {
  const { no, name, isEvaluate, } = req.body;
  console.log(req.body);
  const newMission = new Mission({
    no: no,
    name,
    isEvaluate
  });

  await newMission.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Mission created successfully"
  });

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

export const updateMissionWithSubmissions = async (req, res) => {
  const { id } = req.params;
  const { submissionUpdates, ...missionData } = req.body;

  try {
    // Update mission data
    const mission = await Mission.findById(id);
    if (!mission) throw new NotFoundError(`No mission with id: ${id}`);

    // Update mission fields
    Object.assign(mission, missionData);
    await mission.save();

    // Update submissions if provided
    if (submissionUpdates && Array.isArray(submissionUpdates)) {
      const updatePromises = submissionUpdates.map(async (subUpdate) => {
        if (!subUpdate._id) return null;

        const submission = await Submission.findById(subUpdate._id);
        if (!submission) {
          console.warn(`Submission not found with id: ${subUpdate._id}`);
          return null;
        }

        Object.assign(submission, {
          name: subUpdate.name,
          imageUrl: subUpdate.imageUrl || submission.imageUrl,
          videoUrl: subUpdate.videoUrl || submission.videoUrl,
          evaluate: subUpdate.evaluate
        });

        return submission.save();
      });

      await Promise.all(updatePromises.filter(Boolean));
    }

    // Return updated mission with populated submissions
    const updatedMission = await Mission.findById(id).populate({
      path: 'submission',
      model: 'submissions'
    });

    res.status(StatusCodes.OK).json({ mission: updatedMission });
  } catch (error) {
    console.error('Error in updateMissionWithSubmissions:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error updating mission and submissions',
      error: error.message
    });
  }
};

export const deleteMission = async (req, res) => {
  const { id } = req.params;
  const mission = await Mission.findById(id);

  for (let i = 0; i < mission.submission.length; i++) {
    const submission = await Submission.findOneAndDelete({ _id: mission.submission[i] });
  }

  if (!mission) throw new NotFoundError(`No mission with id: ${id}`);

  await Mission.findOneAndDelete({ _id: mission._id });

  res.status(StatusCodes.OK).json({ msg: "Mission and associated submissions soft deleted successfully", mission });
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
  const { missionId, submissionId } = req.params;

  const submission = await Submission.findByIdAndDelete(submissionId);
  const mission = await MissionModel.updateOne(
    { _id: missionId },
    { $pull: { submission: submissionId } }
  );

  if (!submission) throw new NotFoundError(`No submission with id: ${mission}`);
  res.status(StatusCodes.OK).json({ msg: "Submission deleted successfully", submission });
};

export const createMissionWithSubmissions = async (req, res) => {
  const { id, submissionsData } = req.body;
  try {
    const submissionToCreate = {
      name: submissionsData.name,
      videoUrl: submissionsData.videoUrl || "",
      imageUrl: submissionsData.imageUrl || "",
      evaluate: submissionsData.evaluate
    };


    const submission = await Submission.create(submissionToCreate);
    const mission = await Mission.updateOne(
      { _id: id },
      { $push: { submission: submission._id } }
    );

    // const populatedMission = await Mission.findById(mission._id).populate({
    //   path: 'submission',
    //   model: 'submissions'
    // });

    res.status(StatusCodes.CREATED).json({ submission });
  } catch (error) {
    console.error('Error in createMissionWithSubmissions:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error creating mission with submissions',
      error: error.message
    });
  }
};

// Add new function to get soft deleted missions
export const getSoftDeletedMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ isDeleted: true })
      .populate({
        path: 'submission',
        model: 'submissions'
      });
    res.status(StatusCodes.OK).json({ missions });
  } catch (error) {
    console.error('Error in getSoftDeletedMissions:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error getting soft deleted missions',
      error: error.message
    });
  }
};

// Add function to restore soft deleted missions
export const restoreMission = async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await Mission.findById(id);
    if (!mission) throw new NotFoundError(`No mission with id: ${id}`);

    // Restore the mission
    mission.isDeleted = false;
    await mission.save();

    // Restore associated submissions
    if (mission.submission && mission.submission.length > 0) {
      await Submission.updateMany(
        { _id: { $in: mission.submission } },
        { isDeleted: false }
      );
    }

    res.status(StatusCodes.OK).json({
      msg: "Mission and associated submissions restored successfully",
      mission
    });
  } catch (error) {
    console.error('Error in restoreMission:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Error restoring mission',
      error: error.message
    });
  }
};
