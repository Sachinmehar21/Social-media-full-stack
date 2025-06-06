const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    profilepicture: {
      type: String,
      default: () => {
        const defaultImages = [
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966760/Default_1_y75bjs.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966762/Default_2_d4bntf.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966770/Default_3_j5rkzp.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966759/Default_4_lcjtue.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966768/Default_5_tzabby.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966766/Default_6_zjyxij.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966762/Default_7_mtx3fh.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966761/Default_8_sggi0d.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966765/Default_9_uy6w2e.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966763/Default_10_y0vmei.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966765/Default_11_qlvjdn.png",
          "https://res.cloudinary.com/dyvfgglux/image/upload/v1738966766/Default_12_fwexns.png",
        ];
        return defaultImages[Math.floor(Math.random() * defaultImages.length)];
      }
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;