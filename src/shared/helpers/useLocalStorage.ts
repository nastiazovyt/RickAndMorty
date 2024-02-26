export function localStorageSaver() {
    const set = (key: string, value: string) => {
        localStorage.setItem(key, JSON.stringify(value))
    }

    const get = (key: string) => {
        const value = localStorage.getItem(key)
        return value ? JSON.parse(value) : null
    }

    return {set, get}
}
