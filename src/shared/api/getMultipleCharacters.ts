import {AxiosInstance} from "./axiosinstance.ts";
import {Character} from "../types.ts";

export const getMultipleCharacters = async (idArray: string[]):Promise<Character[]>  => {
    const {data} = await AxiosInstance.get(`/character/${idArray.join(',')}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return Array.isArray(data) ? data : [data]
}
