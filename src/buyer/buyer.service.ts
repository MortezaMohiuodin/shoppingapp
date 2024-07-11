import {CartService , cartService} from './cart/cart.service'
import { ProductService,productService } from '../seller/product/product.service'
import { AddProductToCardDto , UpdateCartProductQuantityDto , RemoveProductFromCartDto } from './dtos/cart.dto'
import { BadRequestError, NotAuthorizedError } from '@shp_ahmad5five/common'
import Stripe from 'stripe'
export class BuyerService {
    constructor(
        public cartService:CartService,
        public productService:ProductService
        public stripeService : Stripe
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
    async checkout(userId:string,cartToken:string,userEmail:string){
        const cart = await this.cartService.findOneByUserId(userId)
        if(!cart) return new BadRequestError('your cart is empty')
        if(cart.products.length === 0) return new BadRequestError('your cart is empty')
        const {id} = await this.stripeService.customers.create({
            email: userEmail,
            source:cartToken
        })
        if(!id) return new BadRequestError('invalid data')
        const charge = await this.stripeService.charges.create({
            amount: cart.totalPrice * 100,
            currency : 'usd',
            customer : id
        })
        if(!charge) return new BadRequestError('Invalid data! could not create the charge')
        // create new order 
        // clear cart
        return charge
    }

}
export const buyerService = new BuyerService(cartService,productService,new Stripe(process.env.STRIPE_KEY!,{apiVersion:'2024-06-20'}))