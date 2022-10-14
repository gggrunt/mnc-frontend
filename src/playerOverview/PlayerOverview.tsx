import { Box, Flex, Heading } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper, Row } from '@tanstack/react-table';
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { FiChevronDown, FiChevronUp, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { MmrTag } from '../components/MmrTag';
import { SortableTable } from '../components/SortableTable';
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
        header: () => <span>Win Percentage</span>,
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
    columnHelper.accessor((row) => row.mmr, {
        id: 'mmr',
        cell: (info) => {
            return <MmrTag props={{ size: 'md' }} player={info.row.original} />;
        },
        header: () => <span>MMR</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.mmrChange, {
        id: 'mmrChange',
        cell: (info) => {
            const value = info.getValue();
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}
                >
                    {value === -999 ? (
                        <h1>-</h1>
                    ) : (
                        <>
                            {value}
                            {value === 0 ? (
                                <FiMinus size={'24'} color={'orange'} />
                            ) : value > 0 ? (
                                <FiChevronUp size={'24'} color={'green'} />
                            ) : (
                                <FiChevronDown size={'24'} color={'red'} />
                            )}
                        </>
                    )}
                </div>
            );
        },
        header: () => <span>MMR Change</span>,
        meta: {
            isNumeric: true,
        },
    }),
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

    let averageGames = 0;
    let averageMmr = 0;
    let count = 0;

    const scatterData = processedData.map((value) => {
        averageGames = value.totalGames + averageGames;

        if (value.mmr > 0) {
            averageMmr = value.mmr + averageMmr;
            count++;
        }

        return {
            x: value.totalGames,
            y: value.mmr,
            label: value.name,
        };
    });

    const averageData = [
        { x: averageGames / count, y: Math.round(averageMmr / count) },
    ];

    return (
        <Flex direction='column' justifyContent='center' alignItems='center'>
            <Heading>Player Overview</Heading>
            <Box width={720} alignSelf={'center'} marginBottom={8}>
                <Scatter
                    data={{
                        datasets: [
                            {
                                data: scatterData,
                                backgroundColor: 'rgba(26, 133, 255, 0.2)',
                                borderColor: 'rgb(26, 133, 255)',
                                pointBackgroundColor: 'rgb(26, 133, 255)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(26, 133, 255)',
                                pointRadius: 6,
                            },
                            {
                                label: 'Average',
                                data: averageData,
                                backgroundColor: 'rgba(212,17,89,0.2)',
                                borderColor: 'rgb(212,17,89)',
                                pointBackgroundColor: 'rgb(212,17,89)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(212,17,89)',
                                pointRadius: 12,
                            },
                        ],
                    }}
                    options={{
                        scales: {
                            x: {
                                type: 'linear',
                                min: 0,
                                max: mmrPerMatch.length,
                            },
                            y: {
                                min: 1300,
                                suggestedMax: 1800,
                            },
                        },
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => {
                                        if (
                                            tooltipItem.dataset.label ===
                                            'Average'
                                        ) {
                                            return 'Average';
                                        }

                                        return scatterData[
                                            tooltipItem.dataIndex
                                        ].label;
                                    },
                                    afterLabel: (tooltipItem) => {
                                        return tooltipItem.parsed.y.toString();
                                    },
                                },
                            },
                        },
                    }}
                />
            </Box>
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
