import { createSelector } from '@reduxjs/toolkit'
import { AppState } from '../rootReducer'

export const getChampions = (state: AppState) => state.gameInfo.champions

export type GameInfoSelector<State> = Readonly<{
    getChampionMap: (state: State) => { [key: string]: string }
}>

export const gameInfoSelector: GameInfoSelector<AppState> = {
    getChampionMap: createSelector(getChampions, (champions) => {
        return champions ?? {}
    }),
}
