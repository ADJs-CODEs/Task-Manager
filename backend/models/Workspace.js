const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "member"], default: "member" },
      },
    ],
    inviteToken: { type: String, unique: true, sparse: true },
    inviteRole: { type: String, enum: ["admin", "member"], default: "member" },
    memberNotes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: { type: String, default: "" },
        color: { type: String, default: "Yellow" },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);