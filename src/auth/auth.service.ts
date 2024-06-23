import { NextFunction } from "express";
import { AuthDto } from "./dtos/auth.dto";
import { userService, UserService } from "./user/user.service";
import { BadRequestError , AuthenticationService} from "@shp_ahmad5five/common";

export class AuthService{
    constructor(
        public userService : UserService,
        public authenticationService:AuthenticationService
    ){

    }
    async signup(AuthDto:AuthDto,errCallback:NextFunction){
        const existingUser = await this.userService.findOneByEmail(AuthDto.email)
        if(existingUser) return errCallback(new BadRequestError('A user with same email exists!'))
        const newUser = await this.userService.create(AuthDto)
        
        const jwt = this.authenticationService.generateJwt({email:AuthDto.email, userId :  newUser.id} , process.env.JWT_KEY!)
        return jwt
    }
    async signin(signinDto:AuthDto,errCallback:NextFunction){
        const user = await this.userService.findOneByEmail(signinDto.email)
        if(!user) return errCallback(new BadRequestError('wrong Credintials'))
        const _samePwd = this.authenticationService.pwdCompare(user.password,signinDto.password)
        if(!_samePwd) return errCallback(new BadRequestError('wrong Credintials'))     
        const jwt = this.authenticationService.generateJwt({email:user.email, userId :  user.id} , process.env.JWT_KEY!)
        return jwt
    }

}
export const authService = new AuthService(userService, new AuthenticationService())