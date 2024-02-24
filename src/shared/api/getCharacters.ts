import {AxiosInstance} from "./axiosinstance.ts";

export const getCharacters = async (name: string, page: number, type: string, species: string, gender: string, status: string) => {
    const {data} = await AxiosInstance.get(`/character/?page=${page}&name=${name}&type=${type}&species=${species}&gender=${gender}&status=${status}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return data
}

export type CharacterResponse = {
    info: Info,
    results: Character[]
}

export type Info = {
    count: number,
    next: string | null,
    pages: number,
    prev: string | null
}

export type Character = {
    id: number,
    name: string,
    status: string,
    species: string,
    type: string,
    gender: string,
    origin: CharacterLocations,
    location: CharacterLocations,
    image: string,
    episode: string[],
    url: string,
    created: string
}

export type CharacterLocations = {
    name: string,
    url: string
}
