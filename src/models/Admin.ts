import mongoose, { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminDoc = mongoose.InferSchemaType<typeof AdminSchema> & { _id: mongoose.Types.ObjectId };

export const Admin = models.Admin || model("Admin", AdminSchema);
