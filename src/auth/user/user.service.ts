import { UserModel } from "@shp_ahmad5five/common";
import {User} from './user.model'
import {AuthDto} from '../dtos/auth.dto'

export class UserService{
    constructor(
        public userModel : UserModel
    ){}
    async create(AuthDto:AuthDto){
        const user = new this.userModel({
            email: AuthDto.email,
            password:AuthDto.password
        })
        return await user.save() 
    }
    async findOneByEmail(email:string){
        return await this.userModel.findOne({email})
    }
}
export const userService = new UserService(User)