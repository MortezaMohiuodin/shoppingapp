import {CartService , cartService} from './cart/cart.service'
import { ProductService,productService } from '../seller/product/product.service'
import { AddProductToCardDto , UpdateCartProductQuantityDto , RemoveProductFromCartDto } from './dtos/cart.dto'
import { BadRequestError, NotAuthorizedError } from '@shp_ahmad5five/common'
import Stripe from 'stripe'
import { OrderService , orderService } from './order/order.service'
export class BuyerService {
    constructor(
        public cartService:CartService,
        public productService:ProductService,
        public orderService:OrderService,
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
        
        let customer_id :string

        if(cart.customer_id){
            customer_id = cart.customer_id
        }else{
            const {id} = await this.stripeService.customers.create({
                email:userEmail,
                source:cartToken
            })
            customer_id = id
            await cart.set({customer_id}).save()
        }
        
        const {id} = await this.stripeService.customers.create({
            email: userEmail,
            source:cartToken
        })
        if(!id) return new BadRequestError('invalid data')
        if(!customer_id) return new BadRequestError('Invalid date')
        const charge = await this.stripeService.charges.create({
            amount: cart.totalPrice * 100,
            currency : 'usd',
            customer : customer_id
        })
        if(!charge) return new BadRequestError('Invalid data! could not create the charge')
        // create new order
        await this.orderService.createOrder({userId,totalAmount:cart.totalPric,chargeId:charge.id})
        // clear cart
        await this.cartService.clearCart(userId,cart._id)
        return charge
    }
    async updateCustomerStripeCart(userId:string,newCartToken:string){
        const cart = await this.cartService.findOneByUserId(userId)
        if(!cart) return new BadRequestError('your cart is empty!')
        if(!cart.customer_id) return new BadRequestError('your a customer!')
        try {
            await this.stripeService.customers.update(cart.customer_id,{
                source: newCartToken
            })
        } catch (err) {
            return new Errr('cart update failed')
        }
        return true
    }
}
export const buyerService = new BuyerService(cartService,productService,orderService,
    new Stripe(process.env.STRIPE_KEY!,{apiVersion:'2024-06-20'}))