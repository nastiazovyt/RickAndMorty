import {AxiosInstance} from "./axiosinstance.ts";

export const getLocations = async (name: string, page: number, type: string, dimension: string) => {
    const {data} = await AxiosInstance.get(`/location/?page=${page}&name=${name}&type=${type}&dimension=${dimension}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return data
}

