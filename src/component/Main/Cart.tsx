import React, {FC, MouseEventHandler} from "react"
import cart from "../../pic/cart.png"
import img from "../../pic/img.png"
import {Button, createMuiTheme, Grid, Icon, Typography} from "@material-ui/core";
import {CenterComp} from "../utility/CenterComp";
import {green} from "@material-ui/core/colors";
import {ThemeProvider} from "@material-ui/core/styles"
import {FoodInCart} from "../../dataStructure/Food";


const theme = createMuiTheme({
    palette: {
        primary: green,
    }
});


export interface CartProps {
    items: FoodInCart[]

    onClear?: MouseEventHandler

    onAdd?: MouseEventHandler
    onReduce?: MouseEventHandler
    onRemove?: MouseEventHandler

    onOrder: MouseEventHandler

}


interface FoodItemProps {
    item: FoodInCart
    onAdd?: MouseEventHandler
    onReduce?: MouseEventHandler
    onRemove?: MouseEventHandler

    index:number

}


const FoodItem: FC<FoodItemProps> = (props) => {

    return (
        <div style={{width: "fit-content", position: 'relative', borderBottom: '1px solid #ededed',marginTop:'10px'}}>
            <Grid container>

                <Grid item xs={3}>
                    <img src={props.item.imgHref} alt={""} style={{maxWidth:'100%'}}/>
                </Grid>

                <Grid item>
                    <Typography variant={"h6"} style={{fontStyle:'12px'}}>{props.item.name}</Typography>
                    <Typography variant={"caption"}>{`${props.item.style} ${props.item.size}cm`}</Typography>
                </Grid>

                <span style={{cursor: "pointer", position: "absolute", top: '2px', right: 0}} onClick={props.onRemove}
                      data-tag={props.index}>
                    <Icon>clear</Icon>
                </span>
            </Grid>

            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px',marginLeft:'2px'}}>

                <Icon style={{cursor: "pointer"}} onClick={props.onReduce} data-tag={props.index}>remove_circle_outline</Icon>
                <Typography style={{marginRight: "2px", marginLeft: "2px"}} >{props.item.number}</Typography>
                <Icon style={{cursor: "pointer"}} onClick={props.onAdd} data-tag={props.index}>add_circle_outline</Icon>
                <div style={{flexGrow: 1}}/>
                <Typography>{(props.item.number * props.item.price).toFixed(2)} BYN</Typography>
            </div>
        </div>
    )
}


interface OrderViewProps {

    total: number
    onOrder?: MouseEventHandler

}


const OrderView: FC<OrderViewProps> = (props) => {

    return (
        <React.Fragment>
            <Grid container justify={"space-between"} style={{marginTop: '5px'}}>
                <Grid item>
                    <Typography gutterBottom>
                        Total:
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography gutterBottom>
                        {props.total.toFixed(2)} BYN
                    </Typography>
                </Grid>
            </Grid>

            <CenterComp>
                <ThemeProvider theme={createMuiTheme()}>
                    <ThemeProvider theme={theme}>
                        <Button variant={"contained"} color={"primary"} style={{color: 'white'}}
                                onClick={props.onOrder}>
                            ORDER NOW
                        </Button>
                    </ThemeProvider>
                </ThemeProvider>
            </CenterComp>

        </React.Fragment>
    )

}


export const Cart: FC<CartProps> = (props) => {

    let total = 0;

    const foodItems = [];

    props.items.forEach((value, index) => {

        foodItems.push(<FoodItem item={value} onAdd={props.onAdd} onReduce={props.onReduce}
                                 onRemove={props.onRemove} index={index}/>);
        total += value.number * value.price;
    });


    return (
        <React.Fragment>
            <div
                style={{
                    margin:"10%",
                    width: "80%",
                    backgroundColor: "#ffffff",
                    padding: "10px",
                    position: 'relative'
                }}>
                <CenterComp><img src={cart} alt=""/></CenterComp>

                <Grid container justify={"space-between"} alignItems={"center"}
                      style={{marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #F8F8F8'}}>
                    <Grid item><Typography style={{
                        color: '#70544f',
                        cursor: 'pointer',
                        fontSize: '18px'
                    }}>{props.items.length} Item</Typography></Grid>
                    <Grid item><Typography style={{color: '#009471', cursor: 'pointer'}}
                                           onClick={props.onClear}>clear</Typography></Grid>
                </Grid>

                {foodItems}
                <OrderView total={total} onOrder={props.onOrder}/>
            </div>
        </React.Fragment>
    )
}

Cart.defaultProps = {


    onClear: () => {
    },
    onAdd: () => {
    },
    onReduce: () => {
    },
    onRemove: () => {
    },
    onOrder: () => {
    },
}
