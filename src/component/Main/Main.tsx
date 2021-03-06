import React, {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {Content, Slide} from "./Slide";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import {Food, FoodSelected} from "./Food";
import {Cart, CartProps} from "./Cart";
import * as DataType from "../../dataStructure/Food";
import * as FoodType from "../../dataStructure/Food";
import axios from "axios";
import {responseHandler} from "../../utility/handler"
import {FoodInCart} from "../../dataStructure/Food";
import {useAddress, useLocalUserInfo} from "../../utility/Hooks";
import {Address} from "../../dataStructure/Address";


const contents:Content[] = [
    {
        imgHref: "https://api.papajohns.by//images/banners/45a911975201f9ee9e969c0970b66abb.webp",
        ref:(el) => {

            if (el === null)
                return;

            el.style.cursor = "pointer";
            el.onclick = () => {
                window.location.href = "https://www.baidu.com"
            }


        }
    },
    {
        imgHref: "https://api.papajohns.by//images/banners/8a4dc9f4edfe60e7a8fc90631e089001.webp",
        ref:el => {

            if (el === null)
                return;

            el.style.cursor = "pointer";
            el.onclick = () => {
                window.location.href = "https://www.google.com";
            }

        }
    }
];



interface PayDialogProps {
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
    foodItems:FoodInCart[]
    setItem:Dispatch<SetStateAction<FoodInCart[]>>

}



const  PayDialog:FC<PayDialogProps> = props => {


    const [userInfo,setUserInfo] = useLocalUserInfo();
    const [addList,setAddrList] = useAddress(userInfo?userInfo.user_id:0);


    let selectedAddr;

    let total = 0;
    props.foodItems.forEach(value => total += value.price * value.number);

    function payClick() {

        axios.post("/api/order", {

            user_id:userInfo.user_id,
            address_id:selectedAddr,
            total:total.toFixed(2),
            items:props.foodItems.map(value => ({FoodSale_id:value.id,number:value.number}))
        }).then(resp => responseHandler<string| undefined>(resp))
            .then(data => {

                if (data == undefined) {
                    alert('Pay successfully');
                    props.setOpen(false);
                    props.setItem([]);
                } else
                    alert(data)
            });
    }



    return (
        <React.Fragment>
            <Dialog open={props.open} onClose={() =>props.setOpen(false)}>
                <DialogTitle>Pay</DialogTitle>

                <DialogContent>
                    <Typography variant={"h5"}>Total:{total.toFixed(2)}</Typography>
                </DialogContent>

                <DialogActions>
                    <Select onChange={e => selectedAddr = e.target.value}>
                        {
                            addList.map(value =>
                                <MenuItem
                                    value={value.address_id}
                                    key={value.address_id}>
                                    {value.district + "," + value.detail}
                                </MenuItem>
                            )
                        }
                    </Select>

                    <Button color={"primary"} onClick={payClick}>Pay</Button>
                </DialogActions>


            </Dialog>
        </React.Fragment>
    )



}




export const Main:FC = () => {

    const cartprops:CartProps = {
        onOrder:(event) => {
            if (userInfo == undefined) {
                alert('please login');
                return;
            }
            setOpen(true)
        },
        onAdd:(event) => {

            const index =  Number(event.currentTarget.getAttribute('data-tag'));

            setItem(prevState =>
                prevState.map((value, index1) => {
                    if (index1 === index)
                        return {...value,number:value.number + 1};
                    return value;
                })
            )
        },
        onReduce:(event) => {

            const index =  Number(event.currentTarget.getAttribute('data-tag'));

            setItem(prevState => {
                const newItem = [];
                prevState.forEach((value, i) => {
                    if (i === index) {
                        if (value.number !== 1) {
                            const newVal = {...value,number:value.number - 1};
                            newItem.push(newVal);
                        }
                    } else
                        newItem.push(value);
                });
                return newItem;
            })
        },

        onRemove:(event) => {

            const index =  Number(event.currentTarget.getAttribute('data-tag'));

            setItem(prevState => prevState.filter((value, index1) => !(index1 === index)))

        },

        items:[
            {
                id:1,
                imgHref:'https://api.papajohns.by//images/catalog/thumbs/cart/5de635455d9da1c6eff2bf07c4dc9896.jpg',
                name:'Vegan Margarita',
                size:"40cm",
                style:'Traditional crust',
                price:49.9,
                number:1
            },

            {
                id:2,
                imgHref:'https://api.papajohns.by//images/catalog/thumbs/cart/90436fa6488234dec4a319444342fb0f.png',
                name:'Ham and Mushrooms',
                size:"40",
                style:'Traditional crust',
                price:29.4,
                number:1
            },


            {
                id:3,
                imgHref:'https://api.papajohns.by//images/catalog/thumbs/cart/90436fa6488234dec4a319444342fb0f.png',
                name:'Ham and Mushrooms',
                size:"40",
                style:'cheese crust',
                price:35.3,
                number:1
            },
        ]
    }


    const [open,setOpen] = useState(false);
    const [items,setItem] = useState<FoodInCart[]>([]);

    const [foods,setFoods] = useState<FoodType.FoodArea[]>([]);

    const [userInfo,setUserInfo] = useLocalUserInfo();


    async function addToCartClick(food:FoodSelected) {

        setItem(prevState => {

            let inside = false;

            const newState = prevState.map(value => {
                if (value.id === food.id) {
                    inside = true;
                    return {...value,number:value.number + 1};
                }
                return value;
            });

            if (!inside)
                newState.push({...food,number: 1});
            return newState;
        });
    }




    useEffect(() => {
        axios.get("/api/foodAreas")
            .then(resp => responseHandler<FoodType.FoodArea[]>(resp))
            .then(data => setFoods(data));
    },[]);


    return (
        <React.Fragment>
            <Slide content={contents}/>
            <div style={{marginLeft:"200px",marginRight:"200px"}}>
                <Grid container>
                    <Grid item xs={9}>
                        {
                            foods.map(value => {
                                return <FoodArea
                                    key={value.category}
                                    category={value.category}
                                    items={value.items}
                                    addToCartClick={addToCartClick}
                                />
                            })
                        }
                    </Grid>
                    <Grid item xs={3}>
                            <div style={{position:'sticky',top:'80px'}}>
                                <Cart
                                    items={items}
                                    onOrder={cartprops.onOrder}
                                    onClear={() => {setItem([]);}}
                                    onRemove={cartprops.onRemove}
                                    onReduce={cartprops.onReduce}
                                    onAdd={cartprops.onAdd}
                                />
                            </div>
                    </Grid>
                </Grid>
            </div>
            <PayDialog open={open} setOpen={setOpen} foodItems={items} setItem={setItem}/>
        </React.Fragment>
    )
}



type FoodAreaProps = DataType.FoodArea & {addToCartClick:(food:FoodSelected)=>Promise<void>};

export const FoodArea:FC<FoodAreaProps> = (props) => {


    return (
        <React.Fragment>
            <div>
                <h1 style={{color:'#70544F',marginBottom:'10px'}} id={props.category}>{props.category}</h1>
            </div>
            <Grid container spacing={2} alignItems={"stretch"}>
            {
                props.items.map(value =>
                    <Food key={value.FoodBase_id}
                          FoodBase_id={value.FoodBase_id}
                          name={value.name}
                          ingredients={value.ingredients}
                          category={value.category}
                          image={value.image}
                          style_size_price={value.style_size_price}
                          addToCartClick={props.addToCartClick}
                    />
                )
            }
            </Grid>
        </React.Fragment>
    )
}
