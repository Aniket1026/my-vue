import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVeirificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "<onboarding@resend.dev>",
      to: email,
      subject: "my vue | verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, status: 200, message: "Verification email sent" };
  } catch (error) {
    console.error("Error sending verification email : ", error);
    return {
      success: false,
      status: 500,
      message: "Error sending verification email",
    };
  }
};
