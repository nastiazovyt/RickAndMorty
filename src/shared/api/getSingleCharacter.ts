import {AxiosInstance} from "./axiosinstance.ts";
import {ResultType} from "./getCharacters.ts";

export const getSingleCharacter = async (id: number): Promise<{data: ResultType}> => {
    const {data} = await AxiosInstance.get(`/character/${id}`).catch(e => {
        throw new Error(`/character/${id} error ${e}`)
    });

    return data
}
