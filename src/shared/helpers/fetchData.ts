import {Character, CharacterResponse, Episode, EpisodesResponse, LocationResponse} from "./types.ts";
import {getCharacters, getLocations, getEpisodes, getMultipleCharacters, getMultipleEpisodes} from "../api";

export const fetchCharactersData = async ({name, pageParam, type, species, gender, status}: {
    name: string,
    pageParam: number,
    type: string,
    species: string,
    gender: string,
    status: string
}): Promise<CharacterResponse> => {
    return getCharacters(name, pageParam, type, species, gender, status)
}

export const fetchLocationsData = async ({name, pageParam, type, dimension,}: {
    name: string,
    pageParam: number,
    type: string,
    dimension: string,
}): Promise<LocationResponse> => {
    return getLocations(name, pageParam, type, dimension)
}

export const fetchEpisodesData = async ({name, pageParam, air_date, episode,}: {
    name: string,
    pageParam: number,
    air_date: string,
    episode: string,
}): Promise<EpisodesResponse> => {
    return getEpisodes(name, pageParam, air_date, episode)
}

export const fetchMultipleCharactersData = async (idArray: string[]): Promise<Character[]> => {
    return getMultipleCharacters(idArray)
}

export const fetchMultipleEpisodesData = async (idArray: string[]): Promise<Episode[]> => {
    return getMultipleEpisodes(idArray)
}
