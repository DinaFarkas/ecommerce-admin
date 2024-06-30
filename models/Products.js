const {model,Schema, default: mongoose} = require("mongoose");

const ProductSchema= new Schema({
    title: {type:String, required: true},
    description: String,
    price: {type:Number, required: true},
});

export const Product= mongoose.models.Product || model('Product', ProductSchema);

 