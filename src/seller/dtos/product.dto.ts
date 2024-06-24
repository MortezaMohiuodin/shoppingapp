import {Request} from 'express'
export interface CreateProductDto{
    title: string;
    price:number;
    userId : string;
    files: Request['files'] 
}