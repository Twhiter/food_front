import React, {Dispatch, FC, SetStateAction, useState} from "react";
import {useParams} from "react-router";
import {CenterComp} from "../utility/CenterComp";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {fetchUserInfo, useAddress, useSimpleOrders} from "../../utility/Hooks";
import Button from "@material-ui/core/Button";
import {Address} from "../../dataStructure/Address";
import {CheckRespData, UserBaseInfo} from "../../dataStructure/UserInfo";
import axios from "axios";
import {responseHandler} from "../../utility/handler";
import {SimpleOrder} from "../../dataStructure/Order";

export function Setting() {

    const user_id = Number((useParams<{ user_id: string }>()).user_id);

    const [baseInfo, setBaseInfo] = fetchUserInfo(user_id);
    const [addressList,setAddressList] = useAddress(user_id);
    const [simpleOrders,setSimpleOrders] = useSimpleOrders(user_id);


    return (
        <React.Fragment>

            <CenterComp style={{marginTop:'200px'}}>
                <Grid container spacing={2} style={{width:'250px'}}>

                    <Grid item xs={12}>
                        <TextField label={"user_id"}  fullWidth value={baseInfo.user_id}/>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label={"username"} fullWidth value={baseInfo.username}/>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label={"phone"} fullWidth value={baseInfo.phone}/>
                    </Grid>

                    <Button color={"primary"}>
                        <Typography align={"center"} color={"primary"}>change mobile phone number</Typography>
                    </Button>

                    <Button color={"primary"} style={{width:'100%'}}>
                        <Typography align={"center"} color={"primary"}>change password</Typography>
                    </Button>
                </Grid>

            </CenterComp>


            <CenterComp>
                <div style={{marginTop:'50px',width:"25%"}}>
                    <AddressList addressList={addressList}/>
                </div>
            </CenterComp>


        <CenterComp>
            <OrderComp SimpleOrders={simpleOrders}/>
        </CenterComp>



        </React.Fragment>
    )
}


interface OrderCompProps {
    SimpleOrders:SimpleOrder[]
}

const OrderComp:FC<OrderCompProps> = props => {

    return (
        <React.Fragment>
            <div style={{marginTop:'50px'}}>

                <TableContainer>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>Order Id</TableCell>
                            <TableCell>Create Time</TableCell>
                            <TableCell>Delivery Time</TableCell>
                            <TableCell>Finish Time</TableCell>
                            <TableCell>Cancel time</TableCell>
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
                                    <TableCell>{value.create_time?new Date(value.create_time).toLocaleString():''}</TableCell>
                                    <TableCell>{value.delivery_time}</TableCell>
                                    <TableCell>{value.finish_time}</TableCell>
                                    <TableCell>{value.cancel_time}</TableCell>
                                    <TableCell>{value.district}</TableCell>
                                    <TableCell>{value.detail}</TableCell>
                                    <TableCell>{value.phone}</TableCell>
                                    <TableCell>
                                        <Button
                                            color={"primary"}
                                            onClick={()=>window.location.href='/order/' + value.order_id}>
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










interface PhoneChangeDialog {
    setBaseInfo:Dispatch<SetStateAction<UserBaseInfo>>
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>,
    userBaseInfo:UserBaseInfo
}



const PhoneChangeDialog:FC<PhoneChangeDialog> = props => {

    const [error,setError] = useState(true);
    const [helperText,setHelperText] = useState("");



    async function checkPhoneExis(value) {
        const resp = await axios.get("/api/checkPhone/" + value);
        const data = await responseHandler<CheckRespData>(resp);

        if (data == undefined)
            return true;

        return data.error;
    }


    function phoneRule(value) {
        if (value.length !== 9) {
            return false
        } else if (Number.isNaN(Number(value))) {
            return false;
        } else
            return true;
    }

    async function changePhone(value) {

        if (phoneRule(value))
            setHelperText("invalid phone number");
        else if (await checkPhoneExis(value))
            setHelperText("Phone already exist");
        else
            axios.put("/api/user/" + props.userBaseInfo,{...props,phone:value})
                .then(resp => responseHandler<boolean>(resp))
                .then(data => {
                    if (data == undefined)
                        return
                    if (!data)
                        alert('change fail!');
                    else {
                        alert('change successfully!');
                        props.setBaseInfo({...props.userBaseInfo,phone:value});
                        props.setOpen(false);
                    }
                })
    }




    return (
        <React.Fragment>
            <Dialog open={props.open} onClose={() => props.setOpen(false)}>
                <DialogTitle>Change Phone</DialogTitle>
                <DialogContent>
                    <TextField label={"Phone"}/>
                </DialogContent>

                <DialogActions>
                    <Button color={"primary"}>change</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )


}


interface AddressListProps {
    addressList:Address[]
}


const AddressList:FC<AddressListProps> = props => {
    return (
        <React.Fragment>
            <Typography variant={"h5"}>My Adress</Typography>
            {props.addressList.map(value =>
                <AddressItem address={value} key={value.address_id}/>
            )}

            <CenterComp style={{marginTop:'10px'}}>
                <Button color={"primary"}>Add New Address</Button>
            </CenterComp>
        </React.Fragment>
    )

}


interface AddressItemProps {
    address:Address
}

const AddressItem:FC<AddressItemProps> = props => {

    return (
        <React.Fragment>
            <div style={{boxSizing:"border-box",marginTop:'16px',borderBottom:'1px solid black'}}>

                <Grid container justify={"space-between"}>
                    <Grid item>
                        <Typography color={"primary"}>{props.address.district}</Typography>
                        <Typography color={"textSecondary"}>{props.address.detail}</Typography>
                    </Grid>

                    <Grid item>
                        <Button color={"primary"}>Modify</Button>
                        <Button color={"secondary"}>Delete</Button>
                    </Grid>

                </Grid>
            </div>
        </React.Fragment>
    )
}
