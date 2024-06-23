import { JwtPayload } from "@shp_ahmad5five/common"
import { AppModule } from "./module"

declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtPayload
        }
    }
}

import express from 'express'
const bootstrap = ()=>{
    const app = new AppModule(express())
    app.start()
}
bootstrap()