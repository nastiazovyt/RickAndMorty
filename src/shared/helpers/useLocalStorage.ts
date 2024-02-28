export const localStorageSaver = {
     set: (key: string, value: string) => {
        localStorage.setItem(key, JSON.stringify(value))
    }
,
     get: (key: string) => {
        const value = localStorage.getItem(key)
        return value ? JSON.parse(value) : null
    }
}

export const withDefault = (key: string) => {
    return () => localStorageSaver.get(key) ?? ''
}

export const setWithLocalStorage = (key: string, setter: (value: string) => void) => {
    return (value: string) => {
        setter(value)
        localStorageSaver.set(key, value)
    }
}
