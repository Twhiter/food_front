import React, {CSSProperties, FC, useState} from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    createMuiTheme,
    Grid,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {green} from "@material-ui/core/colors";
import {FoodInCart, FoodOnSale} from "../../dataStructure/Food";
import {CenterComp} from "../utility/CenterComp";


const theme = createMuiTheme({
    palette: {
        primary: green,
    }
});

const btnStyle: CSSProperties = {
    color: 'white'
}




export interface FoodSelected {
    id:number
    imgHref: string
    name: string
    size: string
    style: string
    price: number
}


interface FoodProps extends FoodOnSale {

    addToCartClick:(food:FoodSelected)=>Promise<void>
}






export const Food: FC<FoodProps> = (props) => {


    function addToCartClick() {

        props.addToCartClick({
            id:props.style_size_price[foodStyle][size].id,
            imgHref:props.image,
            name:props.name,
            size:size,
            style:foodStyle,
            price: props.style_size_price[foodStyle][size].price
        });
    }

    const [foodStyle, setFoodStyle] = useState(Object.keys(props.style_size_price)[0]);

    const [size, setSize] = useState(Object.keys(props.style_size_price[foodStyle])[0]);


    function handleStyleChange(event) {
        setFoodStyle(event.target.value);
        setSize(Object.keys(props.style_size_price[event.target.value])[0]);
    }

    function handleSizeChange(event) {
        setSize(event.target.value);
    }


    return (
        <React.Fragment>

            <Grid item xs={4}>
                <Card style={{height:'100%',position:'relative'}}>
                    <CardMedia
                        image={props.image}
                        title={props.name}
                        style={{height: "0", paddingTop: '56.25%'}}
                    />

                    <CardContent>

                        <Typography gutterBottom variant={"h5"} component={'h2'}>
                            {props.name}
                        </Typography>

                        <div style={{minHeight:'70px'}}>
                            <Typography component="p" color="textSecondary">
                                {props.ingredients.join(',')}
                            </Typography>
                        </div>
                    </CardContent>

                    <CardActions>

                        <ThemeProvider theme={createMuiTheme()}>


                            <Grid container>
                                <Grid item xs={12}>
                                    <ThemeProvider theme={createMuiTheme()}>

                                        <CenterComp style={{marginBottom:'20px'}}>

                                            <Select value={foodStyle} onChange={handleStyleChange} autoWidth={true}
                                                    style={{marginRight:'10px'}}>
                                                {
                                                    Object.keys(props.style_size_price).map(
                                                        value => <MenuItem key={value} value={value}>{value}</MenuItem>)
                                                }
                                            </Select>

                                            <Select value={size} onChange={handleSizeChange} autoWidth={true}
                                                    style={{marginLeft:'10px'}}>
                                                {
                                                    Object.keys(props.style_size_price[foodStyle]).map(
                                                        value => <MenuItem key={value} value={value}>{value}</MenuItem>)
                                                }
                                            </Select>



                                        </CenterComp>
                                    </ThemeProvider>
                                </Grid>




                                <div style={{width:"100%"}}>
                                    <ThemeProvider theme={theme}>
                                        <div style={{display:"flex",justifyContent:"space-between",alignItems:'center'}}>
                                            <Button
                                                onClick={addToCartClick}
                                                color={"primary"}
                                                variant={"contained"}
                                                style={btnStyle}>Add to Cart</Button>
                                            <Typography variant={"h5"} style={{color:'#70544f'}}>{props.style_size_price[foodStyle][size].price + "BYN"}</Typography>
                                        </div>
                                    </ThemeProvider>
                                </div>
                            </Grid>


                        </ThemeProvider>
                    </CardActions>
                </Card>
            </Grid>


        </React.Fragment>

    )
}




