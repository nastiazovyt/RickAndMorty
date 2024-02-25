import {AxiosInstance} from "./axiosinstance.ts";

export const getEpisodes = async (name: string, page: number, air_date: string, episode: string) => {
    const {data} = await AxiosInstance.get(`/episode/?page=${page}&name=${name}&air_date=${air_date}&episode=${episode}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return data
}

