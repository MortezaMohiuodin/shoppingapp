import {Router,Response,Request,NextFunction} from 'express'
import {requireAuth , CustomError} from '@shp_ahmad5five/common'
import { buyerService } from './buyer.service'


const router = Router()
router.post('/cart/add',requireAuth,async (req:Request,res:Response,next:NextFunction)=>{
    const {productId,quantity} = req.body
    const result = await buyerService.addProductToCart({productId,quantity,userId:req.currentUser!.userId})
    if(result instanceof CustomError || result instanceof Error) return next(result)
    res.status(200).send(result)
})
export {router as buyerRouters}