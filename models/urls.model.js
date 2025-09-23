const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema(
  {
    redirectUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
    },
    history: [
      {
        visits: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
