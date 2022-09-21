import { combineReducers, Reducer } from 'redux'
import { gameInfoReducer, GameInfoState } from './gameInfo/gameInfoReducer'
import { statsReducer, StatsState } from './stats/statsReducer'

export interface AppState {
    stats: StatsState
    gameInfo: GameInfoState
}

export const rootReducer: Reducer<AppState> = combineReducers({
    stats: statsReducer,
    gameInfo: gameInfoReducer,
})
