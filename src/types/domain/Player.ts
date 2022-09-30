import { Champion } from './Champion';

export type PlayerRecord = {
    name: string;
    wins: number;
    losses: number;
    totalGames: number;
    winPercentage: number;
};

export type Player = {
    name: string;
    wins?: number;
    losses?: number;
    mmr?: number;
    champions?: {
        [key: string]: Champion;
    };
    teammates?: {
        [key: string]: PlayerRecord;
    };
    opponents?: {
        [key: string]: PlayerRecord;
    };
};
