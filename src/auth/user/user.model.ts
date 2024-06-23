import mongoose from 'mongoose'
import {UserModel , UserDoc , AuthenticationService} from '@shp_ahmad5five/common'

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    toJSON : {
        // get user without password
        transform (doc,ret){
            ret.id = ret._id
            delete ret._id
            delete ret.password
        }
    }
})
// do before save , (this)is the model
schema.pre('save',async function(done){
    // if new password , hash and save 
    const authenticationService = new AuthenticationService()
    if(this.isModified('password') || this.isNew){
        const hashedPwd = authenticationService.pwdToHash(this.get('password'))
        this.set('password',hashedPwd)
    }
    done()
})

export const User = mongoose.model<UserDoc,UserModel>('User',schema)