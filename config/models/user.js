const mongoose =require("mongoose") ;

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    allProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
});

const userModel = mongoose.model("User", UserSchema);

module.exports= userModel;