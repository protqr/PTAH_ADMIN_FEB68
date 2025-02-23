import { StatusCodes } from "http-status-codes";
import FileModel from "../models/FileModel.js";
import { BadRequestError, NotFoundError } from "../errors/customError.js";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import axios from "axios";

export const createFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) throw BadRequestError("No file uploaded");

    const uniqueId = nanoid();

    // Upload file to Cloudinary
    const byteArrayBuffer = file.buffer;
    const cloudinaryRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `/uploads/${uniqueId}`,
            resource_type: "raw", // Set raw for files other than images
          },
          (error, uploadResult) => {
            if (error) {
              console.error("Cloudinary error:", error);
              return reject({
                message: "Cloudinary file upload failed",
                error,
              });
            }
            return resolve(uploadResult);
          }
        )
        .end(byteArrayBuffer);
    });

    // Log file details to MongoDB
    const fileItem = await FileModel.create({
      name: file.originalname,
      size: file.size,
      public_id: cloudinaryRes.public_id,
      url: cloudinaryRes.url,
      secure_url: cloudinaryRes.secure_url,
      createdBy: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json(fileItem);
  } catch (error) {
    throw error;
  }
};

export const getFile = async (req, res) => {
  const fileId = req.params._id;
  const file = await FileModel.findById(fileId);
  if (!file) throw NotFoundError("File ID is not found");

  // Download
  const response = await axios({
    url: file.secure_url,
    method: "GET",
    responseType: "stream",
  });

  // Set headers to indicate file download
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
  res.setHeader("Content-Type", response.headers["content-type"]);

  // Pipe the file data to the response
  response.data.pipe(res);
};
