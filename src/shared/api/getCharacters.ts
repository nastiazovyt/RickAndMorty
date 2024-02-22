import {AxiosInstance} from "./axiosinstance.ts";

export const getCharacters = async (page: number): Promise<Character> => {
    const {data} = await AxiosInstance.get(`/character?page=${page}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return data
}

export type Character = {
    info: InfoType,
    results: ResultType[]
}

export type InfoType = {
    count: number,
    next: string | null,
    pages: number,
    prev: string | null
}

export type ResultType = {
    id: number,
    name: string,
    status: string,
    species: string,
    type: string,
    gender: string,
    origin: LocationType,
    location: LocationType,
    image: string,
    episode: string[],
    url: string,
    created: string
}

export type LocationType = {
    name: string,
    url: string
}
