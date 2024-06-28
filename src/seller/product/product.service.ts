import { ProductModel  } from "@shp_ahmad5five/common";
import { Product } from "./product.model";
import { CreateProductDto, UpdateProductDto , DeleteProductDto } from "../dtos/product.dto";
import fs from 'fs'
import path from 'path'
const uploadDir = 'upload/'
export class ProductService {
    constructor(public productModel:ProductModel){

    }
    async findOneById(productId : string){
        return await this.productModel.findById(productId)
    }
    async create(createProductDto:CreateProductDto){
        const images = this.generateProductImages(createProductDto.files)
        const product = new this.productModel({
            title : createProductDto.title,
            price: createProductDto.price,
            user : createProductDto.userId,
            images : images
        })
        return await product.save()
    }

    async updateProduct(updateProductDto:UpdateProductDto){
        return await this.productModel.findOneAndUpdate({_id:updateProductDto.productId},{$set:{title:updateProductDto.title,price:updateProductDto.price}},{new:true})
    }
    async deleteProduct(deleteProductDto:DeleteProductDto){
        return await this.productModel.findOneAndDelete({_id:deleteProductDto.productId})
    }
    generateBase64Url(contentType:string,buffer:Buffer){
        return `data:${contentType}:base64,${buffer.toString('base64')}`
    }
    generateProductImages(files:CreateProductDto['files']) : Array<{src:string}>{
        let images : Array<Express.Multer.File>
        if(typeof files === 'object'){
            images = Object.values(files).flat()
        }else{
            images = files ? [...files] : []
        }
        return images.map((file:Express.Multer.File)=>{
            const fileBuffer = fs.readFileSync(path.join(uploadDir + file.filename))
            let srcObj = {src:this.generateBase64Url(file.mimetype,fileBuffer)}
            fs.unlink(path.join(uploadDir + file.filename),()=>{

            })
            return srcObj
        })

    }

}
export const productService = new ProductService(Product)