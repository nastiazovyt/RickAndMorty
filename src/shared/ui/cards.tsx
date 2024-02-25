import {Character, Episode, Location} from "../types.ts";

export function CharacterCard({character, handlers}: {
    character: Character,
    handlers: {
        chooseActiveCard: (character: Character) => void,
        setModalActive: (isActive: boolean) => void
    }
}) {
    const onClickHandler = () => {
        handlers.chooseActiveCard(character)
        handlers.setModalActive(true)
    }
    return (
        <li onClick={onClickHandler}
            className="hover:shadow-2xl transition-all ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden pb-4 flex flex-col gap-y-4"
            key={character.id}>
            <img className="w-80 h-auto" src={character.image} alt={character.name}/>
            <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{character.name}</span>
        </li>
    )
}

export function LocationCard({location, handlers}: {
    location: Location,
    handlers: {
        chooseActiveCard: (location: Location) => void,
        setModalActive: (isActive: boolean) => void
    }
}) {
    const onClickHandler = () => {
        handlers.chooseActiveCard(location)
        handlers.setModalActive(true)
    }
    return (
        <li onClick={onClickHandler}
            className="hover:shadow-2xl transition-all ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden pb-4 flex flex-col gap-y-4"
            key={location.id}>
            <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{location.name}</span>
            <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{location.type}</span>
            <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{location.dimension}</span>
        </li>
    )
}

export function EpisodeCard({episode, handlers}: {
    episode: Episode,
    handlers: {
        chooseActiveCard: (episode: Episode) => void,
        setModalActive: (isActive: boolean) => void
    }
}) {
    const onClickHandler = () => {
        handlers.chooseActiveCard(episode)
        handlers.setModalActive(true)
    }
    return (
        <li onClick={onClickHandler}
            className="hover:shadow-2xl transition-all ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden pb-4 flex flex-col gap-y-4"
            key={episode.id}>
            <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{episode.name}</span>
            <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{episode.air_date}</span>
            <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{episode.episode}</span>
        </li>
    )
}
