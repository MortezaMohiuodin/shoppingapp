import {CartService , cartService} from './cart/cart.service'
import { ProductService,productService } from '../seller/product/product.service'
import { AddProductToCardDto } from './dtos/cart.dto'
import { BadRequestError } from '@shp_ahmad5five/common'

export class BuyerService {
    constructor(
        public cartService:CartService,
        public productService:ProductService
    ){}
    async addProductToCart(addProductToCartDto:AddProductToCardDto){
        const product = await this.productService.getOneById(addProductToCartDto.productId)
        if(!product) return new BadRequestError('Product not found!')

        return await this.cartService.addProduct(addProductToCartDto,product)
    }
}
export const buyerService = new BuyerService(cartService,productService)