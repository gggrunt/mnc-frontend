import { createAction } from '@reduxjs/toolkit'

export enum GameInfoActionType {
    HydrateChampionsComplete = 'GameInfoActions/HydrateChampionsComplete',
}

export const GameInfoAction = {
    hydrateChampionsComplete: createAction(
        GameInfoActionType.HydrateChampionsComplete,
        (data: { [key: string]: string }) => ({
            type: GameInfoActionType.HydrateChampionsComplete,
            payload: data,
        })
    ),
}
