import { createReducer } from '@reduxjs/toolkit'
import { GameInfoAction } from './gameInfoActions'

/**
 * State containing game information about league of legends and its champions
 */
export type GameInfoState = Readonly<{
    champions:
        | {
              [id: string]: string
          }
        | undefined
}>

const initialState: GameInfoState = {
    champions: undefined,
}

export const gameInfoReducer = createReducer(initialState, (builder) => {
    builder.addCase(
        GameInfoAction.hydrateChampionsComplete,
        (state, action) => {
            state.champions = action.payload
        }
    )
})
