import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {UserBaseInfo, UserInfo} from "../dataStructure/UserInfo";
import axios from "axios";
import {responseHandler} from "./handler";
import {Address} from "../dataStructure/Address";
import {OrderDetail, SimpleOrder} from "../dataStructure/Order";

export function useLocalUserInfo():[UserInfo,Dispatch<SetStateAction<UserInfo>>] {

    const localData = localStorage.getItem("userInfo");

    let data = null;
    if (localData != null)
        data = JSON.parse(localData);

    const [userInfo,setUserInfo] = useState<UserInfo>(data);

    return [userInfo,setUserInfo];
}

export function fetchUserInfo(user_id:number):[UserBaseInfo, Dispatch<SetStateAction<UserBaseInfo>>] {

    const [baseInfo,setBaseInfo] = useState<UserBaseInfo>({
        user_id:0,
        username:"",
        phone:""
    });

    useEffect(() => {
        axios.get("/api/user/" + user_id)
            .then(resp => responseHandler<UserBaseInfo>(resp))
            .then(data => {
                setBaseInfo(data);
                console.log(data)
            });
    },[]);

    return [baseInfo,setBaseInfo];

}


export function useAddress(user_id:number):[Address[], Dispatch<SetStateAction<Address[]>>] {

    const [address,setAddress] = useState([]);

    useEffect(() => {

        (async function() {
            const data = await fetchAddress(user_id);
            if (data == undefined)
                return;
            setAddress(data);
        })();


    },[]);

    return [address,setAddress];
}

export async function fetchAddress(user_id:number) {

   const resp = await  axios.get("/api/userAddress/" + user_id);
    return await responseHandler<Address[]>(resp);

}


export async function fetchSimpleOrder(user_id: number) {
    const resp = await  axios.get("/api/userOrder/" + user_id);
    return await responseHandler<SimpleOrder[]>(resp);
}


export function useSimpleOrders(user_id:number):[SimpleOrder[], Dispatch<SetStateAction<SimpleOrder[]>>] {

    const [simpleOrders,setSimpleOrders] = useState([]);

    useEffect(() => {

        fetchSimpleOrder(user_id).then(data => setSimpleOrders(data));

    },[])

    return [simpleOrders,setSimpleOrders]
}


export async function fetchDetailOrders(order_id: number) {
    const resp = await  axios.get("/api/orderDetail/" + order_id);
    return await responseHandler<OrderDetail[]>(resp);
}


export function useDetailOrders(order_id:number):[OrderDetail[],Dispatch<SetStateAction<OrderDetail[]>>] {

    const [detailOrders,setDetailOrders] = useState<OrderDetail[]>([]);

    useEffect(()=>{
        fetchDetailOrders(order_id)
            .then(data => setDetailOrders(data));
    },[]);

    return [detailOrders,setDetailOrders];
}

export async function fetchAllSimpleOrders() {
    const resp = await  axios.get("/api/orders");
    return await responseHandler<SimpleOrder[]>(resp);
}

export function useAllSimpleOrders():[SimpleOrder[], Dispatch<SetStateAction<SimpleOrder[]>>] {

    const [simpleOrders,setSimpleOrders] = useState([]);

    useEffect(() => {

        fetchAllSimpleOrders().then(data => setSimpleOrders(data));

    },[])

    return [simpleOrders,setSimpleOrders]
}


export async function fetchAllIngredients() {
    return axios.get("/api/ingredients").then(resp =>responseHandler<string[]>(resp));
}

export function useAllIngredients():[string[],Dispatch<SetStateAction<string[]>>] {

    const [allIngredients,setAllIngredients] = useState<string[]>([]);

    useEffect(() => {

        fetchAllIngredients().then(data => {

            if (data ==undefined)
                return;
            setAllIngredients(data);
        });

        },[]);

    return [allIngredients,setAllIngredients];
}




