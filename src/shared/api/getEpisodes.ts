import {AxiosInstance} from "./axiosinstance.ts";

export const getEpisodes = async (name: string, page: number, episode: string) => {
    const {data} = await AxiosInstance.get(`/episode/?page=${page}&name=${name}&episode=${episode}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return data
}

export type EpisodesResponse = {
    info: Info,
    results: Episode[]
}

export type Info = {
    count: number,
    next: string | null,
    pages: number,
    prev: string | null
}

export type Episode = {
    id: number,
    name: string,
    air_date: string,
    episode: string,
    characters: string[]
    url: string,
    created: string
}
