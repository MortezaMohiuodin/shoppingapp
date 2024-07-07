import {Router,Response,Request,NextFunction} from 'express'
import {requireAuth , CustomError, BadRequestError} from '@shp_ahmad5five/common'
import { buyerService } from './buyer.service'


const router = Router()
router.post('/cart/add',requireAuth,async (req:Request,res:Response,next:NextFunction)=>{
    const {productId,quantity} = req.body
    const result = await buyerService.addProductToCart({productId,quantity,userId:req.currentUser!.userId})
    if(result instanceof CustomError || result instanceof Error) return next(result)
    res.status(200).send(result)
})

router.post('/cart/:cartId/product/:id/update-quantity',async (req:Request,res:Response,next:NextFunction)=>{
    const {amount} = req.body
    const {cartId,id:productId} = req.params
    const inc = req.body.inc === 'true' ? true : req.body.inc === 'false' ? false : null
    if(inc === null) return next(new BadRequestError('inc should be either true or false'))
    
    const result = await buyerService.updateCartProductQuantity({cartId,productId,options:{amount}})
    if(result instanceof CustomError || result instanceof Error) return next(result)
    res.status(200).send(result)
})


export {router as buyerRouters}