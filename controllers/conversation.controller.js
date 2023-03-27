import conversationModel from "../models/conversation.model.js";

export const createConversation = async (req, res) => {
  const conv = await conversationModel.findOne({
    sellerId: req.user.isSeller ? req.user.userId : req.body.to,
    buyerId: req.user.isSeller ? req.body.to : req.user.userId,
  });

  if (conv) {
    const updatedConv = await conversationModel.findByIdAndUpdate(
      conv._id,
      {
        $set: {
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { runValidators: true, new: true }
    );
    res.status(200).json(updatedConv);
  } else {
    const newConv = new conversationModel({
      sellerId: req.user.isSeller ? req.user.userId : req.body.to,
      buyerId: req.user.isSeller ? req.body.to : req.user.userId,
      readBySeller: req.user.isSeller,
      readByBuyer: !req.user.isSeller,
    });
    const saveConv = await newConv.save();

    res.status(201).json(saveConv);
  }
};

export const getConversations = async (req, res) => {
  const conv = await conversationModel
    .find(
      req.user.isSeller
        ? { sellerId: req.user.userId }
        : { buyerId: req.user.userId }
    )
    .sort({ updatedAt: -1 });
  res.status(200).json(conv);
};
