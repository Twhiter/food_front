import {ServerResponse} from "../dataStructure/ServerResponse";


export async function responseHandler<T>(resp) {

    const d = resp.data as ServerResponse<T>;
    if (d.status !== 0)
        errorHandler(d.status,d.msg);
    return d.data;
}

async function errorHandler(status: number,msg:string) {
    if (status === -1)
        window.alert(msg);
}
