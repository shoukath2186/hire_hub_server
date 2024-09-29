import mongoose,{Model,Schema,Document} from "mongoose";

import { ICategory } from "../../entities/iCategory";


const CategorySchema:Schema<ICategory>=new Schema({
    name:{
        type:String,
        required:true
    },
    is_block:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true}) 

const CategoryModal:Model<ICategory&Document>=mongoose.model<ICategory&Document>(
    'Category',
    CategorySchema
)

export default CategoryModal


