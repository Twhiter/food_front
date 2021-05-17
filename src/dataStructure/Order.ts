import {UserBaseInfo} from "./UserInfo";
import {Address} from "./Address";


export interface Order {
    order_id:number
    address_id:number
    create_time:string
    delivery_time:string
    finish_time:string
    cancel_time:string
    total:number
}


export type SimpleOrder = UserBaseInfo & Address & Order

export interface OrderDetail {

    FoodSale_id:number
    size:string
    style:string
    price:number
    FoodBase_id:number

    order_id:number
    number:number

    name:string
    image:string
}





