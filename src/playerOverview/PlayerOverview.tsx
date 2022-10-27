import { Flex, Heading } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper, Row } from '@tanstack/react-table';
import React from 'react';
import { FiChevronDown, FiChevronUp, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { SortableTable } from '../components/SortableTable';
import { SprTag } from '../components/SprTag';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import { Player } from '../types/domain/Player';
import {
    getMmrTrendingChange,
    mapMmrHistoryCollectionToPlayerMmrHistoryMap,
} from '../utils/mmrHelpers';

type PlayerTableData = {
    name: string;
    wins: number;
    winPercentage: string;
    losses: number;
    totalGames: number;
    mmr: number;
    mmrChange: number;
};

/**
 * Given a collection of players, map to a collection of players with processed stats
 * @param players A collection of playeres to process
 */
const processPlayers = (
    players: Player[] | undefined,
    mmrMap: { [key: string]: { gameId: number; mmr: number }[] }
): PlayerTableData[] => {
    return players
        ? players
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((player) => {
                  const wins = player.wins ?? 0;
                  const losses = player.losses ?? 0;
                  const totalGames = wins + losses;
                  const mmr = mmrMap[player.name] ?? [];
                  return {
                      ...player,
                      wins,
                      losses,
                      winPercentage:
                          Math.round((wins / totalGames) * 100) + '%',
                      totalGames: totalGames,
                      mmr:
                          totalGames >= 10 ? Math.round(player.mmr ?? 1500) : 0,
                      mmrChange:
                          totalGames > 10 ? getMmrTrendingChange(mmr) : -999,
                  };
              })
        : [];
};

const columnHelper = createColumnHelper<PlayerTableData>();

const columns: ColumnDef<PlayerTableData, any>[] = [
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
    columnHelper.accessor((row) => row.losses, {
        id: 'losses',
        cell: (info) => info.getValue(),
        header: () => <span>Losses</span>,
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
    // TODO: For Season 1, put these back in
    // columnHelper.accessor((row) => row.mmr, {
    //     id: 'mmr',
    //     cell: (info) => {
    //         return <SprTag props={{ size: 'md' }} player={info.row.original} />;
    //     },
    //     header: () => <span>MMR</span>,
    //     meta: {
    //         isNumeric: true,
    //     },
    // }),
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
    //     header: () => <span>MMR Trend</span>,
    //     meta: {
    //         isNumeric: true,
    //     }
    //}),
];

export const PlayerOverview = React.memo(function PlayerOverview() {
    const navigate = useNavigate();
    const usePlayersResponse = ToxicDataService.usePlayers();
    const data = usePlayersResponse.data;

    const mmrPerMatchResponse = ToxicDataService.useMmrPerMatch();
    const mmrPerMatch = mmrPerMatchResponse.data ?? [];
    const mmrPerMatchMap =
        mapMmrHistoryCollectionToPlayerMmrHistoryMap(mmrPerMatch);

    const processedData = processPlayers(data, mmrPerMatchMap);

    return (
        <Flex direction='column' justify='center' align='center'>
            <Heading>Player Overview</Heading>
            <SortableTable
                columns={columns}
                data={processedData}
                getRowProps={(row: Row<any>) => {
                    return {
                        onClick: () => {
                            navigate(row.getValue('name'));
                            window.scrollTo(0, 0);
                        },
                    };
                }}
            />
        </Flex>
    );
});
