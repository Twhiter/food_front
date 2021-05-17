import React from "react";
import {useParams} from "react-router";
import {CenterComp} from "../utility/CenterComp";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import {useDetailOrders, useSimpleOrders} from "../../utility/Hooks";

export const DetailOrder = props => {


    const order_id = Number(useParams<{order_id:string}>().order_id);
    const [orderDetails,setOrderDetail] = useDetailOrders(order_id);



    return (
        <React.Fragment>

            <CenterComp>
                <Typography variant={"h5"}>detail order for order_id={order_id}</Typography>
            </CenterComp>


            <CenterComp>
                <div style={{width:"60%"}}>
                    <TableContainer>
                        <Table>

                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Picture</TableCell>
                                    <TableCell>Size</TableCell>
                                    <TableCell>Style</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Number</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    orderDetails.map(value => (
                                        <TableRow key={value.FoodSale_id}>
                                            <TableCell>{value.name}</TableCell>
                                            <TableCell><img src={value.image} alt={""}/></TableCell>
                                            <TableCell>{value.size}</TableCell>
                                            <TableCell>{value.style}</TableCell>
                                            <TableCell>{value.price}</TableCell>
                                            <TableCell>{value.number}</TableCell>
                                            <TableCell>{(value.price * value.number).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </CenterComp>




        </React.Fragment>
    )

}
