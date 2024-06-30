export interface AddProductToCardDto{
    userId:string;
    quantity:number;
    productId: string;
}
export interface CreateCartProductDto{
    cartId : string;
    quantity:number;
    productId:string
}