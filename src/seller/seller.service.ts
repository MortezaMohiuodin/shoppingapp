import { BadRequestError, NotAuthorizedError } from "@shp_ahmad5five/common";
import { CreateProductDto, UpdateProductDto , DeleteProductDto } from "./dtos/product.dto";
import { ProductService , productService } from "./product/product.service";

export class SellerService{
    constructor(
        public productService : ProductService
    ){

    }
    async addProduct(createProductDto : CreateProductDto){
        return await this.productService.create(createProductDto)
    }
    async updateProduct(updateProductDto:UpdateProductDto){
        const product = await this.productService.findOneById(updateProductDto.productId)
        if(!product) return new BadRequestError('Product not found!')
        if(product.user.toString() !== updateProductDto.userId) return new NotAuthorizedError()
        return await this.productService.updateProduct(updateProductDto)        
    }
    async deleteProduct(deleteProductDto:DeleteProductDto){
        const product = await this.productService.findOneById(deleteProductDto.productId)
        if(!product) return new BadRequestError('product not found!')
        if(product.user.toString() !== deleteProductDto.userId){
            return new NotAuthorizedError()
        }
        return await this.productService.deleteProduct(deleteProductDto)
    }
}
export const sellerService = new SellerService(productService)