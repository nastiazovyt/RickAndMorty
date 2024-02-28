import {useEffect} from "react";
import errorSound from "../../assets/error.mp3";

const audio = new Audio(errorSound)

export const useError = (isError: boolean) => {
    useEffect(() => {
        if (isError) void audio.play()
    }, [isError]);
}
