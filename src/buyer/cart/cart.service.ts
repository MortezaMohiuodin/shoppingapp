import {CartModel,CartProductModel,ProductDoc} from "@shp_ahmad5five/common"
import { CartProduct } from "./cart-product.model"
import { Cart } from "./cart.model"
import { AddProductToCardDto,CreateCartProductDto } from "../dtos/cart.dto"
export class CartService {
    constructor(
        public cartModel : CartModel,
        public cartProductModel : CartProductModel
    ){}
    async findOneByUserId(userId:string){
        return await this.cartModel.findOne({user:userId})
    }
    async createCart(userId:string){
        const cart = new this.cartModel({
            user:userId
        })
        return await cart.save()
    }
    async createCartProduct(createCartProductDto:CreateCartProductDto){
        const cartProdcut = new this.cartProduct({
            cart : createCartProductDto.cartId,
            product:createCartProductDto.productId,
            quantity:createCartProductDto.quantity
        })

    }
    async addProduct(addProductToCardDto:AddProductToCardDto , product:ProductDoc){
        const {userId,quantity,productId} = addProductToCardDto
        let cart = await this.findOneByUserId(userId)
        if(!cart) cart = await this.createCart(userId)
        const cartProduct = await this.createCartProduct({cartId:cart._id , productId,quantity})
        return await this.cartModel.findOneAndUpdate({_id:cart._id},
            {$push:{products:cartProduct} , $inc : {totalPrice: product.price * quantity}},{new:true}
        )
    }
}
export const cartService = new CartService(Cart,CartProduct)