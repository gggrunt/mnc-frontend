import { Flex, Heading } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper, Row } from '@tanstack/react-table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SortableTable } from '../components/SortableTable';
import { SprTag } from '../components/SprTag';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import { Player } from '../types/domain/Player';
import {
    getSprTrendingChange,
    mapSprHistoryCollectionToPlayerSprHistoryMap,
    getSprValue,
    MIN_GAMES_REQUIRED,
} from '../utils/sprHelpers';
import season_1_transparent from '../assets/season_1_transparent.png';

type PlayerTableData = {
    name: string;
    wins: number;
    winPercentage: string;
    losses: number;
    totalGames: number;
    spr: number;
    rank: number;
    player: Player;
    mmrChange: number;
};

/**
 * Given a collection of players, map to a collection of players with processed stats
 * @param players A collection of playeres to process
 */
const processPlayers = (
    players: Player[] | undefined,
    sprMap: { [key: string]: { gameId: number; spr: number }[] }
): PlayerTableData[] => {
    return players
        ? players
              .sort((a, b) => {
                  // put all players who have completed their qualifying games to the top of the leaderboard
                  const playerASpr =
                      (a.wins ?? 0) + (a.losses ?? 0) >= MIN_GAMES_REQUIRED
                          ? getSprValue(a) * 1000
                          : getSprValue(a);
                  const playerBSpr =
                      (b.wins ?? 0) + (b.losses ?? 0) >= MIN_GAMES_REQUIRED
                          ? getSprValue(b) * 1000
                          : getSprValue(b);

                  return playerBSpr - playerASpr;
              })
              .map((player, index) => {
                  const wins = player.wins ?? 0;
                  const losses = player.losses ?? 0;
                  const totalGames = wins + losses;
                  const spr = getSprValue(player);
                  const winPercentage =
                      Math.round((wins / totalGames) * 100) + '%';
                  return {
                      ...player,
                      wins,
                      losses,
                      winPercentage: winPercentage,
                      totalGames: totalGames,
                      spr: spr,
                      rank: index + 1,
                      player: player,
                      mmrChange:
                          totalGames > 10
                              ? getSprTrendingChange(sprMap[player.name])
                              : -999,
                  };
              })
        : [];
};

const columnHelper = createColumnHelper<PlayerTableData>();

const columns: ColumnDef<PlayerTableData, any>[] = [
    columnHelper.accessor((row) => row.rank, {
        id: 'rank',
        cell: (info) => info.getValue(),
        header: () => <span>Rank</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.name, {
        id: 'name',
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
    }),
    columnHelper.accessor((row) => row.wins, {
        id: 'wins',
        cell: (info) => info.getValue(),
        header: () => <span>Wins</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.winPercentage, {
        id: 'winPercentage',
        cell: (info) => info.getValue(),
        header: () => <span>Win %</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.totalGames, {
        id: 'totalGames',
        cell: (info) => info.getValue(),
        header: () => <span>Total Games</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.spr, {
        id: 'spr',
        cell: (info) => {
            return (
                <SprTag
                    props={{ size: 'md' }}
                    value={info.row.original.player}
                />
            );
        },
        header: () => <span>SPR</span>,
        meta: {
            isNumeric: true,
        },
    }),
    // columnHelper.accessor((row) => row.mmrChange, {
    //     id: 'mmrChange',
    //     cell: (info) => {
    //         const value = info.getValue();
    //         return (
    //             <div
    //                 style={{
    //                     display: 'flex',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                     flexDirection: 'row',
    //                 }}
    //             >
    //                 {value === -999 ? (
    //                     <h1>-</h1>
    //                 ) : (
    //                     <>
    //                         {value}
    //                         {value === 0 ? (
    //                             <FiMinus size={'24'} color={'orange'} />
    //                         ) : value > 0 ? (
    //                             <FiChevronUp size={'24'} color={'green'} />
    //                         ) : (
    //                             <FiChevronDown size={'24'} color={'red'} />
    //                         )}
    //                     </>
    //                 )}
    //             </div>
    //         );
    //     },
    //     header: () => <span>SPR Trend</span>,
    //     meta: {
    //         isNumeric: true,
    //     },
    // }),
];

export const Leaderboard = React.memo(function Leaderboard() {
    const SEASON_NUMBER = 1;
    const navigate = useNavigate();
    const usePlayersResponse = ToxicDataService.usePlayers(SEASON_NUMBER);
    const data = usePlayersResponse.data;

    const glickoPerMatchResponse =
        ToxicDataService.useGlickoPerMatch(SEASON_NUMBER);
    const glickoPerMatch = glickoPerMatchResponse.data ?? [];
    const sprPerMatchMap =
        mapSprHistoryCollectionToPlayerSprHistoryMap(glickoPerMatch);

    const processedData = processPlayers(data, sprPerMatchMap);

    return (
        <Flex direction='column' justify='center' align='center'>
            <img src={season_1_transparent} alt='season 1 splash' />
            <Heading>Leaderboard</Heading>
            <h1 style={{ marginBottom: 8 }}>
                * Players must complete 30 games before their SPR is qualified
            </h1>
            <SortableTable
                columns={columns}
                data={processedData}
                getRowProps={(row: Row<any>) => {
                    return {
                        onClick: () => {
                            navigate(`/playerOverview/${row.getValue('name')}`);
                            window.scrollTo(0, 0);
                        },
                    };
                }}
            />
        </Flex>
    );
});
