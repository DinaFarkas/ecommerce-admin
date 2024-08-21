const { Schema, models, model, default: mongoose } = require("mongoose");

const CategorySchema= new Schema({
    name:{type:String, required:true},
    parent:{type:Schema.Types.ObjectId, ref:'Category'},
});

export const Category = models?.Category || model ('Category', CategorySchema);