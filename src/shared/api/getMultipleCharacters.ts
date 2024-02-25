import {AxiosInstance} from "./axiosinstance.ts";

export const getMultipleCharacters = async (idArray: string[]) => {
    const {data} = await AxiosInstance.get(`/character/${idArray.join(',')}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return data
}
