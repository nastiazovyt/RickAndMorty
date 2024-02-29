import {getCharacters} from "./shared/api";
import axios from "axios";

test('should return a success if the GET was successful', async () => {
    const mockResponse = {
        data: {
            results: [
                {name: 'Rick'},
                {page: 1},
                {type: 'Human'},
                {species: 'none'},
                {gender: 'Male'},
                {status: 'Dead'}
            ]
        },

    }

    axios.get = jest
        .fn()
        .mockResolvedValue(mockResponse)

    const charactersData = await getCharacters('Rick', 1, 'Human', 'none', 'Male', 'Dead')

    expect(mockResponse.data).toEqual(charactersData)
})
