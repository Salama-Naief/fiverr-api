import messageModel from "../models/message.model.js";
import conversationModel from "../models/conversation.model.js";

export const createMessage = async (req, res) => {
  const newMessage = new messageModel({
    conversationId: req.body.conversationId,
    userId: req.user.userId,
    desc: req.body.desc,
  });

  const savedMessage = await newMessage.save();
  await conversationModel.findOneAndUpdate(
    { _id: req.body.conversationId },
    {
      $set: {
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
        lastMessage: req.body.desc,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(201).send(savedMessage);
};

export const getMessages = async (req, res) => {
  const messages = await messageModel.find({ conversationId: req.params.id });
  res.status(200).send(messages);
};
