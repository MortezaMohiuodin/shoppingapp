import {CartService , cartService} from './cart/cart.service'
import { ProductService,productService } from '../seller/product/product.service'
import { AddProductToCardDto , UpdateCartProductQuantityDto , RemoveProductFromCartDto } from './dtos/cart.dto'
import { BadRequestError, NotAuthorizedError } from '@shp_ahmad5five/common'

export class BuyerService {
    constructor(
        public cartService:CartService,
        public productService:ProductService
    ){}
    async addProductToCart(addProductToCartDto:AddProductToCardDto){
        const product = await this.productService.getOneById(addProductToCartDto.productId)
        if(!product) return new BadRequestError('Product not found!')

        const cart = await this.cartService.addProduct(addProductToCartDto,product)
        if(!cart) return new Error('could not update the cart')
        return cart
    }
    async updateCartProductQuantity(updateCartProductQuantityDto:UpdateCartProductQuantityDto){
        const {productId,cartId} = updateCartProductQuantityDto
        const cartProduct = await this.cartService.getCartProductById(productId,cartId)
        if(!cartProduct) return new BadRequestError('product not found in cart')
        const cart = await this.cartService.updateProductQuantity(updateCartProductQuantityDto)
        return cart
    }
    async removeProductFromCart(removeProductFromCartDto:RemoveProductFromCartDto){
        const {productId,cartId} = removeProductFromCartDto
        const cartProduct = await this.cartService.getCartProductById(productId,cartId)
        if(!cartProduct) return new BadRequestError('product not found in cart')
        const cart = await this.cartService.removeProductFromCart(removeProductFromCartDto)
        if(!cart) return new Error('could not update the cart')
        return cart            
    }
    async getCart(cartId:string , userId:string){
        const cart = await this.cartService.getCart(cartId)
        if(!cart) return new BadRequestError('can nout found in cart')
        if(cart.user.toString() !== userId) return new NotAuthorizedError()
        return cart 
    }


}
export const buyerService = new BuyerService(cartService,productService)