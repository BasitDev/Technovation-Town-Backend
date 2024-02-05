import mongoose from "mongoose";
import { classesSchema } from "./superAdmin/classes.model.js";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            // required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            select: false,
        },
        role: {
            type: String,
            enum: ["SUPERADMIN", "SUBADMIN", "RECRUITER", "TALENT"],
            required: true,
        },
        phone: {
            type: String,
            // required: true,
        },
        country: {
            type: String,
            // required: true,
        },
        // classes: {
        //     type: [classesSchema],
        // },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
