import {AxiosInstance} from "./axiosinstance.ts";
import {Episode} from "../types.ts";

export const getMultipleEpisodes = async (idArray: string[]):Promise<Episode[]>  => {
    const {data} = await AxiosInstance.get(`/episode/${idArray.join(',')}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return Array.isArray(data) ? data : [data]
}
