import {AxiosInstance} from "./axiosinstance.ts";

export const getLocations = async (name: string, page: number, type: string, dimension: string) => {
    const {data} = await AxiosInstance.get(`/location/?page=${page}&name=${name}&type=${type}&dimension=${dimension}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return data
}

export type LocationResponse = {
    info: Info,
    results: Location[]
}

export type Info = {
    count: number,
    next: string | null,
    pages: number,
    prev: string | null
}

export type Location = {
    id: number,
    name: string,
    type: string,
    dimension: string,
    residents: string[]
    url: string,
    created: string
}
