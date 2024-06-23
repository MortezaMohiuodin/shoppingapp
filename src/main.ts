import { JwtPayload } from "@shp_ahmad5five/common/build/constants/globals"
declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtPayload
        }
    }
}

import { JwtPayload } from "@shp_ahmad5five/common/build/constants/globals"
import { AppModule } from "./module"
import express from 'express'
const bootstrap = ()=>{
    const app = new AppModule(express())
    app.start()
}
bootstrap()