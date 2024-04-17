let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
let restaurantSchema = mongoose.Schema({
    address:{
        building:{
            type:String,
            required:true
        },
        coord:{
            type:Array,
            required:true
        },
        street:{
            type:String,
            required:true
        },
        zipcode:{
            type:String,
            required:true
        }
    },
    borough: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    grades: { type:Array,
        required:true,
        date: {
            type: Date,
            required: true
        },
        grade: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
},
    name: {
        type: String,
        required: true
    },
    restaurant_id: {
        type: String,
        required: true
    }
})
restaurantSchema.plugin(mongoosePaginate);
let Restaurants = module.exports = mongoose.model("restaurants", restaurantSchema);