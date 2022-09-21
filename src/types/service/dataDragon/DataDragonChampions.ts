export type Champion = {
    id: string
    name: string
    image: {
        full: string
        sprite: string
    }
}

export type Champions = {
    data: {
        [id: string]: Champion
    }
}
