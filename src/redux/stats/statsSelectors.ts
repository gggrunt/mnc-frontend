import { createSelector } from 'reselect'
import { Champion } from '../../types/domain/Champion'
import { Player } from '../../types/domain/Player'
import { AppState } from '../rootReducer'

export const getPlayers = (state: AppState) => state.stats.players
export const getChampions = (state: AppState) => state.stats.champions

export type StatsSelectors<State> = Readonly<{
    getPlayersCollection: (state: State) => Player[] | undefined
    getPlayer: (state: State, playerId: string) => Player | undefined
    getChampionsCollection: (state: State) => Champion[] | undefined
    getChampion: (state: State, championId: string) => Champion | undefined
}>

export const statsSelector: StatsSelectors<AppState> = {
    getPlayersCollection: createSelector(getPlayers, (players) => {
        return players ? Array.from(Object.values(players)) : undefined
    }),
    getPlayer: createSelector(
        getPlayers,
        (state: AppState, playerId: string) => playerId,
        (players, playerId) => {
            return players ? players[playerId] : undefined
        }
    ),
    getChampionsCollection: createSelector(getChampions, (champions) => {
        return champions ? Array.from(Object.values(champions)) : undefined
    }),
    getChampion: createSelector(
        getChampions,
        (state: AppState, championId: string) => championId,
        (champions, championId) => {
            return champions ? champions[championId] : undefined
        }
    ),
}
