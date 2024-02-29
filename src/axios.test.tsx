import {expect, test} from "@jest/globals";
import {getCharacters} from "./shared/api";

describe('Check characters get request', () => {
    test('Is the GET was successful', async () => {
        const charactersData = await getCharacters('Rick', 1, '', '', '', '')

        expect(charactersData).toMatchObject({
            info: expect.any(Object),
            results: expect.any(Array)
        })

        expect(charactersData.results.length).not.toBe(0)
    })

    test('Response data was not empty', async () => {
        const charactersData = await getCharacters('Rick', 1, '', '', '', '')

        expect(charactersData.results.length).not.toBe(0)
    })
})


