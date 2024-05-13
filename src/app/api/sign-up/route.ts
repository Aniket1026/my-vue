import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import { User, UserModel } from "@/model/User.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request): Promise<ApiResponse> {
  await dbConnect();
  try {
      
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return {
        success: false,
        status: 400,
        message: "Username already exists",
      };
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return {
          success: true,
          status: 200,
          message: "User already exists with this email",
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser: User = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpire: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return {
        success: false,
        status: 500,
        message: emailResponse.message,
      };
    }

    return {
      success: true,
      status: 201,
      message: "User registered , please vrify your user email",
      };
      
  } catch (error) {
    console.error("Error registering user : ", error);
    return {
      success: false,
      status: 500,
      message: "Error registering user",
    };
  }
}
