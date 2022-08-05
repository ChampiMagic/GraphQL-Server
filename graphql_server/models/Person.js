import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        minlength: 5 
    },
    phone: {
        type: String,
        minlength: 5 
    },
    street: {
        type: String,
        require: true,
        minlength: 5 
    },
    city: {
        type: String,
        require: true,
        minlength: 5 
    },
})

schema.plugin(mongooseUniqueValidator)
export default mongoose.model('Person', schema)