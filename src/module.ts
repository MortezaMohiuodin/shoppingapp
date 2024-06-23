import {json, urlencoded } from 'body-parser'
import cookieSession from 'cookie-session'
import * as dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
dotenv.config()
import  {Application} from 'express'
export class AppModule{
    constructor(public app: Application){
        app.set('trust-proxy',true)
        app.use(cors({
            origin:"*",
            credentials:true,
            optionsSuccessStatus:200
        }))

        app.use(urlencoded({extended:true}))
        app.use(json())
        app.use(cookieSession({
            signed:false,
            secure:false
        }))
    }
    async start(){
        if(!process.env.MONGO_URI){
            throw new Error('mongo uri must be defined')
        }
        if(!process.env.JWT_KEY){
            throw new Error('jwt key must be defined')
        }

        try{
            await mongoose.connect(process.env.MONGO_URI)
        }catch(err){
            throw new Error('database connection failed')
        }
        this.app.listen(8080,()=>console.log("port 8080"))
    }
}