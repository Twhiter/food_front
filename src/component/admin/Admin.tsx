import React, {FC} from "react";
import {CenterComp} from "../utility/CenterComp";
import {
    Container, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {responseHandler} from "../../utility/handler";
import {SimpleOrder} from "../../dataStructure/Order";
import {useAllSimpleOrders} from "../../utility/Hooks";


export function AdminLogin() {


    let username: string;
    let pwd: string;

    function LoginClick() {
        (async function () {

            const data = await axios.post("/api/admin/login", {username: username, pwd: pwd})
                .then(resp => responseHandler<boolean>(resp))

            if (!data)
                alert('username or password is incorrect!');
            else
                window.location.href = "/admin/" + username;
        })();
    }


    return (
        <React.Fragment>
            <Container maxWidth={"xs"} style={{marginTop: '250px'}}>

                <CenterComp style={{marginBottom: '10px', marginTop: '10px'}}>
                    <Typography color={"primary"} variant={"h5"}>
                        Admin Login
                    </Typography>
                </CenterComp>


                <CenterComp>
                    <TextField
                        label={"username"}
                        onChange={e => username = e.target.value}
                    />
                </CenterComp>

                <CenterComp>
                    <TextField
                        label={"password"}
                        type={"password"}
                        onChange={e => pwd = e.target.value}
                    />
                </CenterComp>

                <CenterComp style={{marginTop: '10px'}}>
                    <Button color={"primary"} onClick={LoginClick}>Login</Button>
                </CenterComp>
            </Container>

        </React.Fragment>
    )
}



export function OrderCompWrapper() {


    const [simpleOrders,setSimpleOrders] = useAllSimpleOrders();


    return (
        <OrderComp SimpleOrders={simpleOrders}/>
    )


}





interface OrderCompProps {
    SimpleOrders: SimpleOrder[]
}

export const OrderComp: FC<OrderCompProps> = props => {
    return (
        <React.Fragment>
            <div style={{marginTop: '50px'}}>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order Id</TableCell>
                                <TableCell>Create Time</TableCell>
                                <TableCell>Delivery Time</TableCell>
                                <TableCell>Finish Time</TableCell>
                                <TableCell>Cancel time</TableCell>
                                <TableCell>User Id</TableCell>
                                <TableCell>User name</TableCell>
                                <TableCell>District</TableCell>
                                <TableCell>Detail Position</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Operation</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {
                                props.SimpleOrders.map(value => (

                                        <TableRow key={value.order_id}>
                                            <TableCell>{value.order_id}</TableCell>
                                            <TableCell>{value.create_time ? new Date(value.create_time).toLocaleString() : ''}</TableCell>
                                            <TableCell>{value.delivery_time ? new Date(value.delivery_time).toLocaleString() : ''}</TableCell>
                                            <TableCell>{value.finish_time ? new Date(value.finish_time).toLocaleString() : ''}</TableCell>
                                            <TableCell>{value.cancel_time ? new Date(value.cancel_time).toLocaleString() : ''}</TableCell>
                                            <TableCell>{value.user_id}</TableCell>
                                            <TableCell>{value.username}</TableCell>
                                            <TableCell>{value.district}</TableCell>
                                            <TableCell>{value.detail}</TableCell>
                                            <TableCell>{value.phone}</TableCell>
                                            <TableCell>
                                                <Button
                                                    color={"primary"}
                                                    onClick={() => window.location.href = '/order/' + value.order_id}>
                                                    detail
                                                </Button>
                                            </TableCell>
                                        </TableRow>


                                    )
                                )
                            }
                        </TableBody>

                    </Table>
                </TableContainer>
            </div>
        </React.Fragment>
    )
}







