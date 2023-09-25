const mongoose = require('mongoose');

//creating product Schema
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add product name'],
        trim:true,
        maxlength:[100, 'product name can not exceed 1000 charecter']
    },
    price:{
        type:Number,
        required:[true,'Please add product price'],
        maxlength:[5, 'product name can not exceed 1000 charecter'],
        default:0.0
    },
    description:{ 
        type:String,
        required:[true,'Please add product description'],
    },
    ratings:{
        type:Number,
        default:0,
    },
    images: [
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                "Books",
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: 'Please select correct category for product'
        }
    },
    seller:{
        type:String,
        required:[true, 'Plese enter seller'],
    },
    stock:{
        type:Number,
        required:[true,'please enter product stock'],
        maxlength:[5, 'product name can not exceed 5 charecter'],
        default:0,
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            // user:{ //refrencing user for adding created of product
            //     type:mongoose.Schema.ObjectId,
            //     ref:'User',
            //     required:true
            // },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    // user:{ //refrencing user for adding created of product
    //     type:mongoose.Schema.ObjectId,
    //     ref:'User',
    //     required:true
    // },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('product',productSchema);