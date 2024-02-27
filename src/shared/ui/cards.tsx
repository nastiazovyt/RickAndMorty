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
            className="hover:shadow-2xl transition-all font-raleway
            text-green-700 2xl:w-[20rem] ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden p-2 ps-4 pb-4 flex flex-col gap-y-8"
            key={location.id}>
            <span className="text-xl font-bold underline">{location.name}</span>
            <div className="flex flex-col gap-y-1.5 mt-auto">
                <span className="text-sm">{location.type}</span>
                <span className="text-md">{location.dimension}</span>
            </div>
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
            className="hover:shadow-2xl transition-all font-raleway
            text-green-700 2xl:w-[20rem] ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden p-2 ps-4 pb-4 flex flex-col gap-y-8"
            key={episode.id}>
            <span className="text-xl font-bold underline">{episode.name}</span>
            <div className="flex lg:flex-row flex-col gap-x-10 mt-auto">
                <span className="text-sm">{episode.air_date}</span>
                <span className="text-md">{episode.episode}</span>
            </div>
        </li>
    )
}
