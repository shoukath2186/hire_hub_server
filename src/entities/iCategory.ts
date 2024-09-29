import {Document} from "mongoose";

export interface ICategory extends Document {
    name: string;
    is_block:boolean;
    createdAt?: Date;
    updatedAt?: Date;
}