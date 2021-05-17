export interface FoodInCart {

    id:number
    imgHref: string
    name: string
    size: string
    style: string

    price: number
    number: number
}


export interface FoodOnSale {
    FoodBase_id:number
    name:string
    ingredients:string[]
    image:string
    category:string

    // style_size_price['traditional']['21cm'] = {36.5BYN,1}
    style_size_price:Record<string, Record<string, {price:number,id:number}>>
}

export interface FoodArea {
    category:string
    items:FoodOnSale[]
}






