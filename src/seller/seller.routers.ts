import { Router, Request, Response, NextFunction } from "express"
import {Uploader,UploaderMiddlewareOptions,BadRequestError} from '@shp_ahmad5five/common'

const uploader = new Uploader('/upload')
const middlewareOptions : UploaderMiddlewareOptions = {
    types : ['image/png','image/jpeg'],
    fieldName:'image'
}
const multipleFilesMiddleware = uploader.uploaderMultipleFiles(middlewareOptions)


const router = Router()

router.post('/product/new',async (req:Request,res:Response,next:NextFunction)=>{
    const {title,price} = req.body
    if(!req.files) return next(new BadRequestError('images are required'))
    if(req.uploaderError) return next(new BadRequestError(req.uploaderError.message))
    // create product
    // send to user
})