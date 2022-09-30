import { StatsAction } from './statsActions';

import { createReducer } from '@reduxjs/toolkit';
import { Player } from '../../types/domain/Player';
import { Champion } from '../../types/domain/Champion';

/**
 * State containing all game history data focused around players and champions
 */
export type StatsState = Readonly<{
    players:
        | {
              [id: string]: Player;
          }
        | undefined;
    champions:
        | {
              [id: string]: Champion;
          }
        | undefined;
}>;

const initialState: StatsState = {
    players: undefined,
    champions: undefined,
};

export const statsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(
            StatsAction.hydratePlayerStatsActionComplete,
            (state, action) => {
                const playersCollection = action.payload;

                if (state.players === undefined) {
                    state.players = {};
                }

                // iterate through the players collection and insert them into our players map
                for (const player of playersCollection) {
                    const currentPlayer = state.players[player.name];
                    if (currentPlayer) {
                        state.players[player.name] = {
                            ...currentPlayer,
                            name: player.name,
                            wins: player.wins,
                            losses: player.losses,
                            champions: player.champions,
                            teammates: player.teammates,
                            opponents: player.opponents,
                        };
                    } else {
                        state.players[player.name] = player;
                    }
                }
            }
        )
        .addCase(StatsAction.hydratePlayerMmrComplete, (state, action) => {
            const playersCollection = action.payload;

            if (state.players === undefined) {
                state.players = {};
            }

            // iterate through the players collection and insert them into our players map
            for (const player of playersCollection) {
                const currentPlayer = state.players[player.name];

                if (currentPlayer) {
                    state.players[player.name] = {
                        ...currentPlayer,
                        mmr: player.mmr,
                    };
                } else {
                    state.players[player.name] = {
                        name: player.name,
                        mmr: player.mmr,
                    };
                }
            }
        })
        .addCase(
            StatsAction.hydrateChampionStatsActionComplete,
            (state, action) => {
                const championsMap = action.payload;

                if (state.champions === undefined) {
                    state.champions = {};
                }

                if (championsMap) {
                    state.champions = action.payload;
                }
            }
        );
});
