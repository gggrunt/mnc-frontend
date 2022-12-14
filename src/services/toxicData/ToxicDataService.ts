import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback } from 'react';
import { Champion } from '../../types/domain/Champion';
import { Match } from '../../types/domain/Match';
import { GlickoHistoryItem } from '../../types/domain/GlickoHistoryItem';
import { Player } from '../../types/domain/Player';
import { MatchData } from '../../types/service/toxicData/MatchData';
import { GlickoData } from '../../types/service/toxicData/GlickoData';
import { GlickoPerMatchData } from '../../types/service/toxicData/GlickoPerMatchData';
import { StatsData } from '../../types/service/toxicData/StatsData';
import { TrueSkillData } from '../../types/service/toxicData/TrueSkillData';
import {
    getChampionPickBanMap,
    mapMatchHistory,
    mapGlickoPerMatch,
    mapStats,
} from './dataMapper';

const placementEndpoint =
    'https://toxic-api-production.gggrunt16.workers.dev/placement';
const glickoPerMatchEndpoint =
    'https://toxic-api-production.gggrunt16.workers.dev/mmr_per_match';
const statsEndpoint =
    'https://toxic-api-production.gggrunt16.workers.dev/stats';
const matchHistoryEndpoint =
    'https://toxic-api-production.gggrunt16.workers.dev/matches';
const trueskillEndpoint =
    'https://toxic-api-production.gggrunt16.workers.dev/trueskill';

export const fetchPlayers = (season?: number) =>
    axios
        .get<GlickoData>(
            season
                ? `${placementEndpoint}?season=${season.toString()}`
                : placementEndpoint,
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
        .then((res) => res.data);

export const fetchStats = (season?: number) =>
    axios
        .get<StatsData>(
            season
                ? `${statsEndpoint}?season=${season.toString()}`
                : statsEndpoint,
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
        .then((res) => res.data);

const fetchGlickoPerMatch = (season?: number) =>
    axios
        .get<GlickoPerMatchData[]>(
            season
                ? `${glickoPerMatchEndpoint}?season=${season.toString()}`
                : glickoPerMatchEndpoint,
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
        .then((res) => res.data);

const fetchMatchHistory = (season?: number) =>
    axios
        .get<MatchData>(
            season
                ? `${matchHistoryEndpoint}?season=${season.toString()}`
                : matchHistoryEndpoint,
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
        .then((res) => res.data);

const fetchTrueskill = (season?: number) =>
    axios
        .get<TrueSkillData>(
            season
                ? `${trueskillEndpoint}?season=${season.toString()}`
                : trueskillEndpoint,
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
        .then((res) => res.data);

const usePlayerStats = (season?: number) => {
    const fetchStatsFunc = useCallback(() => {
        return fetchStats(season);
    }, [season]);

    return useQuery<
        StatsData,
        Error,
        { players: Player[]; champions: { [id: string]: Champion } }
    >([`stats${season ?? ''}`], fetchStatsFunc, {
        select: (data) => {
            return mapStats(data);
        },
        staleTime: 20000,
    });
};

const usePlayersGlicko = (season?: number) => {
    const fetchPlayersFunc = useCallback(() => {
        return fetchPlayers(season);
    }, [season]);

    return useQuery<GlickoData, Error>(
        [`simpleMmr${season ?? ''}`],
        fetchPlayersFunc,
        {
            staleTime: 20000,
        }
    );
};

const useMatchHistory = (season?: number) => {
    const fetchMatchHistoryFunc = useCallback(() => {
        return fetchMatchHistory(season);
    }, [season]);

    return useQuery<MatchData, Error>(
        [`matchHistory${season ?? ''}`],
        fetchMatchHistoryFunc,
        {
            staleTime: 2000,
        }
    );
};

const useGlickoPerMatch = (season?: number) => {
    const fetchGlickoFunc = useCallback(() => {
        return fetchGlickoPerMatch(season);
    }, [season]);

    return useQuery<GlickoPerMatchData[], Error>(
        [`mmrPerMatch${season ?? ''}`],
        fetchGlickoFunc,
        {
            staleTime: 2000,
        }
    );
};

const usePlayersTrueSkill = (season?: number) => {
    const func = useCallback(() => {
        return fetchTrueskill(season);
    }, [season]);

    return useQuery<TrueSkillData, Error>([`trueskill${season ?? ''}`], func, {
        select: (data) => {
            // we use all lower case ids, where this endpoint is giving us casing in the names
            const result: TrueSkillData = {};
            for (const entry of Object.entries(data)) {
                result[entry[0].toLowerCase()] = entry[1];
            }
            return result;
        },
        staleTime: 20000,
    });
};

type ServiceResponseBase = {
    isLoading: boolean;
    isError: boolean;
};

export const ToxicDataService = {
    usePlayers: (
        season?: number
    ): { data: Player[] | undefined } & ServiceResponseBase => {
        // gets the player information without glicko AND champion information
        const statsResponse = usePlayerStats(season);

        // gets the player's glicko
        const glickoResponse = usePlayersGlicko(season);

        // gets the player's trueskill
        const trueSkillResponse = usePlayersTrueSkill(season);

        const isLoading =
            statsResponse.isLoading ||
            glickoResponse.isLoading ||
            trueSkillResponse.isLoading;
        const isError =
            statsResponse.isError ||
            glickoResponse.isError ||
            trueSkillResponse.isError;

        // merge glicko response, stats response, and trueskill response here
        if (
            statsResponse.data &&
            glickoResponse.data &&
            trueSkillResponse.data
        ) {
            const players = statsResponse.data.players;
            const data = players.map((player) => {
                const trueskill = trueSkillResponse.data[player.name];
                return {
                    ...player,
                    glicko: glickoResponse.data.mmr[player.name],
                    trueskill: trueskill ? trueskill.rating : 0,
                };
            });

            return {
                data,
                isLoading,
                isError,
            };
        } else {
            return {
                data: undefined,
                isLoading,
                isError,
            };
        }
    },
    usePlayer: (
        id: string,
        season?: number
    ): { data: Player | undefined } & ServiceResponseBase => {
        // gets the player information without glicko AND champion information
        const statsResponse = usePlayerStats(season);

        // gets the player's glicko
        const glickoResponse = usePlayersGlicko(season);

        // gets the player's trueskill
        const trueSkillResponse = usePlayersTrueSkill(season);

        const isLoading =
            statsResponse.isLoading ||
            glickoResponse.isLoading ||
            trueSkillResponse.isLoading;
        const isError =
            statsResponse.isError ||
            glickoResponse.isError ||
            trueSkillResponse.isError;

        // merge glicko response, stats response, and trueskill response here
        if (
            statsResponse.data &&
            glickoResponse.data &&
            trueSkillResponse.data
        ) {
            const players = statsResponse.data.players;
            const playerData = players.find((player) => {
                return player.name === id;
            });

            const glickoData = Math.round(glickoResponse.data.mmr[id]);

            return {
                data: {
                    ...playerData,
                    name: id,
                    glicko: glickoData,
                    trueskill: playerData
                        ? trueSkillResponse.data[playerData.name].rating
                        : undefined,
                },
                isLoading,
                isError,
            };
        } else {
            return {
                data: undefined,
                isLoading,
                isError,
            };
        }
    },
    useChampions: (
        season?: number
    ): {
        data: { [id: string]: Champion } | undefined;
    } & ServiceResponseBase => {
        // gets the player information without glicko AND champion information
        const statsResponse = usePlayerStats(season);

        // gets the match history used to compute ban and pick rate
        const matchHistoryResponse = useMatchHistory(season);

        const isLoading =
            statsResponse.isLoading || matchHistoryResponse.isLoading;
        const isError = statsResponse.isError || matchHistoryResponse.isError;

        if (statsResponse.data && matchHistoryResponse.data) {
            const data = statsResponse.data.champions;

            const matchData = matchHistoryResponse.data;
            const matches = matchData ? mapMatchHistory(matchData) : [];
            const championPickBanMap = getChampionPickBanMap(matches);

            // loop through data, and update the pick/ban rate
            for (const championName of Object.keys(data)) {
                const championPickBanData = championPickBanMap[championName];

                data[championName] = {
                    ...data[championName],
                    banPercentage: championPickBanData
                        ? championPickBanData[championPickBanData.length - 1]
                              .ban
                        : undefined,
                    pickPercentage: championPickBanData
                        ? championPickBanData[championPickBanData.length - 1]
                              .pick
                        : undefined,
                };
            }

            return {
                data,
                isLoading,
                isError,
            };
        } else {
            return {
                data: undefined,
                isLoading,
                isError,
            };
        }
    },
    useChampion: (
        id: string,
        season?: number
    ): { data: Champion | undefined } & ServiceResponseBase => {
        // gets the player information without glicko AND champion information
        const statsResponse = usePlayerStats(season);

        // gets the match history used to compute ban and pick rate
        const matchHistoryResponse = useMatchHistory(season);

        const isLoading =
            statsResponse.isLoading || matchHistoryResponse.isLoading;
        const isError = statsResponse.isError || matchHistoryResponse.isError;

        // merge glicko response and stats response here
        if (statsResponse.data && matchHistoryResponse.data) {
            const champion = statsResponse.data.champions[id];

            const matchData = matchHistoryResponse.data;
            const matches = matchData ? mapMatchHistory(matchData) : [];
            const championPickBanMap = getChampionPickBanMap(matches);
            const championPickBanData = championPickBanMap[id];

            const data = {
                ...champion,
                banPercentage: championPickBanData
                    ? championPickBanData[championPickBanData.length - 1].ban
                    : undefined,
                pickPercentage: championPickBanData
                    ? championPickBanData[championPickBanData.length - 1].pick
                    : undefined,
                pickBanHistory: championPickBanData,
            };

            return {
                data,
                isLoading,
                isError,
            };
        } else {
            return {
                data: undefined,
                isLoading,
                isError,
            };
        }
    },
    useMatchHistory: (
        season?: number
    ): {
        data: Match[] | undefined;
    } & ServiceResponseBase => {
        const matchHistoryResponse = useMatchHistory(season);

        if (matchHistoryResponse.data) {
            const matchData = matchHistoryResponse.data;
            return {
                data: mapMatchHistory(matchData),
                isLoading: matchHistoryResponse.isLoading,
                isError: matchHistoryResponse.isError,
            };
        } else {
            return {
                data: undefined,
                isLoading: matchHistoryResponse.isLoading,
                isError: matchHistoryResponse.isError,
            };
        }
    },
    useGlickoPerMatch: (
        season?: number
    ): {
        data: GlickoHistoryItem[] | undefined;
    } & ServiceResponseBase => {
        const glickoPerMatchResponse = useGlickoPerMatch(season);

        if (glickoPerMatchResponse.data) {
            const glickoData = glickoPerMatchResponse.data;
            return {
                data: mapGlickoPerMatch(glickoData),
                isLoading: glickoPerMatchResponse.isLoading,
                isError: glickoPerMatchResponse.isError,
            };
        } else {
            return {
                data: undefined,
                isLoading: glickoPerMatchResponse.isLoading,
                isError: glickoPerMatchResponse.isError,
            };
        }
    },
};
