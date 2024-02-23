import {AxiosInstance} from "./axiosinstance.ts";

export const getCharacters = async (name: string, page: number) => {
    const {data} = await AxiosInstance.get(`/character/?page=${page}&name=${name}`).catch(e => {
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
    origin: Location,
    location: Location,
    image: string,
    episode: string[],
    url: string,
    created: string
}

export type Location = {
    name: string,
    url: string
}
