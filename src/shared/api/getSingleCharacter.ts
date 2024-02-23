import {AxiosInstance} from "./axiosinstance.ts";
import {Character} from "./getCharacters.ts";

export const getSingleCharacter = async (id: number): Promise<{data: Character}> => {
    const {data} = await AxiosInstance.get(`/character/${id}`).catch(e => {
        throw new Error(`/character/${id} error ${e}`)
    });

    return data
}
