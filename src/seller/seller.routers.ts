import { Router, Request, Response, NextFunction } from "express"
import {Uploader,UploadMiddlewareOptions,BadRequestError , requireAuth, CustomError} from '@shp_ahmad5five/common'
import { sellerService } from "./seller.service"

const uploader = new Uploader('upload/')
const middlewareOptions : UploadMiddlewareOptions = {
    types : ['image/png','image/jpeg'],
    fieldName:'image'
}
const multipleFilesMiddleware = uploader.uploadMultipleFiles(middlewareOptions)


const router = Router()

router.post('/product/new',requireAuth,async (req:Request,res:Response,next:NextFunction)=>{
    const {title,price} = req.body
    if(!req.files) return next(new BadRequestError('images are required'))
    if(req.uploaderError) return next(new BadRequestError(req.uploaderError.message))
    // create product
    const product = await sellerService.addProduct({title,price,userId:req.currentUser!.userId, files:req.files})
    // send to user
    res.status(201).send(product)
})
router.post('/product/:id/update',requireAuth,async(req:Request,res:Response,next:NextFunction)=>{
    const {id} = req.params
    const {title , price} = req.body
    const result = await sellerService.updateProduct({title,price,userId:req.currentUser!.userId,productId:id})
    if(result instanceof CustomError) return next(result)
    res.status(200).send(result)
})

router.delete('/proudct/:id/delete',requireAuth,async(req:Request,res:Response,next:NextFunction)=>{
    const {id} = req.params
    const result = await sellerService.deleteProduct({productId:id,userId:req.currentUser!.userId})
    if(result instanceof CustomError) return next(result)
    res.status(200).send(result)
})


export {router as sellerRouters}