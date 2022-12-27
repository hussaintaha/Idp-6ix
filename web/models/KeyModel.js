import mongoose from "mongoose";

const key_details = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    shop: String,
    idpkey: String,
    created_at: String,
    updated_at: String
});

const KeyModel = mongoose.model("KeyDetails", key_details);

export default KeyModel;