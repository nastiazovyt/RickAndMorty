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

export type EpisodesResponse = {
    info: Info,
    results: Episode[]
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

export type LocationResponse = {
    info: Info,
    results: Location[]
}

export type Location = {
    id: number,
    name: string,
    type: string,
    dimension: string,
    characters: string[]
    url: string,
    created: string
}

