import crypto from "crypto";

export const generateTraceId = () => {
    return crypto.randomBytes(16).toString("hex");
}