import {expect, test} from "@jest/globals";
import {localStorageSaver} from "./shared/helpers";

beforeEach(() => {
    window.localStorage.clear();
});

test('Is the data saves to local storage', () => {
    const mockKey = "1";
    const mockData = "mock data";

    localStorageSaver.set(mockKey, mockData);
    expect(localStorage.getItem(mockKey)).toEqual(JSON.stringify(mockData));
})

test('Is the data gets from local storage', () => {
    const mockKey = "2";
    const mockData = "mock data2";

    localStorage.setItem(mockKey, JSON.stringify(mockData))
    expect(localStorageSaver.get(mockKey)).toEqual((mockData));
})

test('Is the data changed in local storage', () => {
    const mockKey = "3";
    const mockDataOld = "mock data3";
    const mockDataNew = "mock data4";

    localStorageSaver.set(mockKey, mockDataOld)
    expect(localStorage.getItem(mockKey)).toEqual(JSON.stringify(mockDataOld));

    localStorageSaver.set(mockKey, mockDataNew)
    expect(localStorage.getItem(mockKey)).toEqual(JSON.stringify(mockDataNew));
})