import { Message } from "@/model/User.model";

export interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
