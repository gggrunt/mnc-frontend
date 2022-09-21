import { Champion } from './Champion'

export type Player = {
    name: string
    wins?: number
    losses?: number
    mmr?: number
    champions?: {
        [key: string]: Champion
    }
}
