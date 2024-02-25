import {AxiosInstance} from "./axiosinstance.ts";

export const getCharacters = async (name: string, page: number, type: string, species: string, gender: string, status: string) => {
    const {data} = await AxiosInstance.get(`/character/?page=${page}&name=${name}&type=${type}&species=${species}&gender=${gender}&status=${status}`).catch(e => {
        throw new Error(`/character error ${e}`)
    });

    return data
}


