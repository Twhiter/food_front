import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {UserBaseInfo, UserInfo} from "../dataStructure/UserInfo";
import axios from "axios";
import {responseHandler} from "./handler";
import {Address} from "../dataStructure/Address";

export function useLocalUserInfo():[UserInfo,Dispatch<SetStateAction<UserInfo>>] {

    const localData = localStorage.getItem("userInfo");

    let data = null;
    if (localData != null)
        data = JSON.parse(localData);

    const [userInfo,setUserInfo] = useState<UserInfo>(data);
    console.log(userInfo);

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


