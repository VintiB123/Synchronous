import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },

  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
  admin: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
  messages: { type: mongoose.Types.ObjectId, ref: "Messages", required: false },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

channelSchema.pre("save", function (next) {
  this.updateAt = Date.now();
  next();
});
channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updateAt: Date.now() });
  next();
});

const Channel = mongoose.model("Channels", channelSchema);
export default Channel;
