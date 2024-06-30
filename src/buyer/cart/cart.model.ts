import mongoose from 'mongoose'
import {CartDoc,CartModel} from '@shp_ahmad5five/common'

const schema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"CartProduct"
        }
    ],
    totalPrice:{type:Number,required:true , default : 0}
})
export const Cart = mongoose.model<CartDoc,CartModel>("Cart",schema)