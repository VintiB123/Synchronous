import User from "../models/UserModel";

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;

    const userId = request.body.userId;

    const admin = await User.findById(userId);
    if (!admin) {
      return response.status(400).send("Admin user not found");
    }
    const validateMembers = await User.find({ _id: { $in: members } });

    if (validateMembers.length !== members.length) {
      return response.status(400).send("Some members are not validate users");
    }
    const newChannel = new Channel({ name, members, admin: userId });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error ");
  }
};
