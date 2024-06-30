import mongoose from 'mongoose'
import {CartProductDoc,CartProductModel} from '@shp_ahmad5five/common'

const schema = new mongoose.Schema({
    cart : {
        type :mongoose.Schema.Types.ObjectId,
        ref:"Cart",
        required:true
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required:true
    },
    quantity:{type:Number,required:true}
})
export const CartProduct = mongoose.model<CartProductDoc,CartProductModel>('CartProduct',schema)