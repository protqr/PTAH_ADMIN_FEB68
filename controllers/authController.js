// authController.js
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customError.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

// export const login = async (req, res) => {
//   const user = await User.findOne({ username: req.body.username });

//   const isValidUser =
//     user && (await comparePassword(req.body.password, user.password));

//   if (!isValidUser)
//     throw new UnauthenticatedError("ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง");

//   // const token = createJWT({ userId: user._id, role: user.role });
//   const token = createJWT({ userId: user._id });

//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === "production",
//   });

//   res.status(StatusCodes.CREATED).json({ msg: "user logged in" });
// };

export const login = async (req, res) => {
  console.log("Login request received:", req.body);

  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    console.log("user not found");
    throw new UnauthenticatedError("ไม่สามารถเข้าสู่ระบบได้");
  }

  const isValidUser = await comparePassword(req.body.password, user.password);
  if (!isValidUser) {
    console.log("Invalid password");
    throw new UnauthenticatedError("ไม่สามารถเข้าสู่ระบบได้");
  }

  const token = createJWT({ userId: user._id});
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.OK).json({ msg: "เข้าสู่ระบบสำเร็จ" });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
