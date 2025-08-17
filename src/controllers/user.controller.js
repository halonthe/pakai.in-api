import "dotenv/config";
import { successResponse, errorResponse } from "../utils/response.js";

export async function getProfile(req,res) {
    return successResponse(res, req.user,'Success getting user data')
}