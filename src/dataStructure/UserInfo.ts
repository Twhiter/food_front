export interface UserInfo {
    user_id:number
    username:string
}

export interface LoginRegisterRespData {

    isOk:boolean,
    token:string
    userInfo:UserInfo
}

export type CheckRespData= {
    error:boolean,
    msg:string
} | undefined

export interface UserBaseInfo extends UserInfo{
    phone:string
}
