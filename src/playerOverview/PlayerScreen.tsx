import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Error } from '../components/Error';
import { SortableTable } from '../components/SortableTable';
import { StatsCard } from '../components/StatsCard';
import { usePlayer } from '../hooks/selectorWrapperHooks';
import { gameInfoSelector } from '../redux/gameInfo/gameInfoSelectors';
import { Champion } from '../types/domain/Champion';
import { Player, PlayerRecord } from '../types/domain/Player';
import { getChampionImage } from '../utils/championImageHelpers';

import { championClassWinRates, ChampionClass } from '../data/championClasses';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import { getMmrColor } from '../utils/mmrColorHelpers';
import { SummonerCollage } from '../components/SummonerCollage';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export async function loader(data: { params: any }) {
    return data.params.playerId;
}

type PlayerScreenChampion = {
    imageUrl: string;
} & Champion;

const MAX_CONTENT_WIDTH = 1024;

/**
 * Given a player, create an array of champions that player has played with image url populated
 * @param data
 */
const processPlayerChampions = (
    data: Player,
    championIdMap: { [key: string]: string }
): PlayerScreenChampion[] => {
    return (
        data.champions ? Array.from(Object.values(data.champions)) : []
    ).map((champion: Champion) => {
        return {
            ...champion,
            imageUrl: championIdMap[champion.name]
                ? getChampionImage(championIdMap[champion.name])
                : '',
        };
    });
};

const columnHelper = createColumnHelper<PlayerScreenChampion>();

const columns: ColumnDef<PlayerScreenChampion, any>[] = [
    columnHelper.accessor((row) => row.name, {
        id: 'name',
        cell: (info) => {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {info.row.original.imageUrl ? (
                        <img
                            src={info.row.original.imageUrl}
                            style={{ width: 32, height: 32, marginRight: 8 }}
                        />
                    ) : null}
                    {info.getValue()}
                </div>
            );
        },
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
];

const teammateColumns: ColumnDef<PlayerScreenChampion, any>[] = [
    columnHelper.accessor((row) => row.name, {
        id: 'name',
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
    }),
    columnHelper.accessor((row) => row.wins, {
        id: 'wins',
        cell: (info) => info.getValue(),
        header: () => <span>Wins With</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.winPercentage, {
        id: 'winPercentage',
        cell: (info) => info.getValue(),
        header: () => <span>Win Percentage With</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.losses, {
        id: 'losses',
        cell: (info) => info.getValue(),
        header: () => <span>Losses With</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.totalGames, {
        id: 'totalGames',
        cell: (info) => info.getValue(),
        header: () => <span>Total Games With</span>,
        meta: {
            isNumeric: true,
        },
    }),
];

const opponentColumns: ColumnDef<PlayerScreenChampion, any>[] = [
    columnHelper.accessor((row) => row.name, {
        id: 'name',
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
    }),
    columnHelper.accessor((row) => row.wins, {
        id: 'wins',
        cell: (info) => info.getValue(),
        header: () => <span>Wins Against</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.winPercentage, {
        id: 'winPercentage',
        cell: (info) => info.getValue(),
        header: () => <span>Win Percentage Against</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.losses, {
        id: 'losses',
        cell: (info) => info.getValue(),
        header: () => <span>Losses Against</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.totalGames, {
        id: 'totalGames',
        cell: (info) => info.getValue(),
        header: () => <span>Total Games Against</span>,
        meta: {
            isNumeric: true,
        },
    }),
];

export const PlayerScreen = React.memo(function PlayerScreen() {
    const navigate = useNavigate();
    const playerId = useLoaderData() as string;
    const player: Player | undefined = usePlayer(playerId ?? '');

    const championIdMap = useSelector(gameInfoSelector.getChampionMap);

    const playerClasses = useMemo(
        () => championClassWinRates(Object.values(player?.champions ?? {})),
        [player]
    );

    const chartLabels = Object.keys(ChampionClass).map((value) => {
        return value.toString();
    });

    const [chartData, setChartData] = useState<
        ChartData<'radar', (number | null)[], unknown>
    >({ datasets: [], labels: chartLabels });

    useEffect(() => {
        setChartData({
            labels: chartLabels,
            datasets: [
                {
                    label: 'Wins',
                    data: Object.values(playerClasses).map(
                        (value) => value.wins
                    ),
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Total Games',
                    data: Object.values(playerClasses).map(
                        (value) => value.losses + value.wins
                    ),
                    fill: true,
                    backgroundColor: 'rgba(99, 132, 255, 0.5)',
                    borderColor: 'rgb(99, 132, 255, 0.5)',
                    pointBackgroundColor: 'rgb(99, 132, 255)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(99, 132, 225)',
                },
            ],
        });
    }, [playerClasses]);

    if (player === undefined) {
        return <Error error={'Player not found!'} />;
    }

    const playerChampionData: Champion[] = processPlayerChampions(
        player,
        championIdMap
    );

    const playerTeammateData: PlayerRecord[] = Object.values(
        player.teammates ?? []
    );
    const playerOpponentData: PlayerRecord[] = Object.values(
        player.opponents ?? []
    );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={{ maxWidth: 1024 }}>
                <div
                    style={{
                        flex: 1,
                        marginBottom: 32,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        maxWidth: 1024,
                    }}
                >
                    <h1
                        style={{
                            fontSize: 32,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                        }}
                    >
                        {player.name.toUpperCase()}
                    </h1>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignSelf: 'stretch',
                            flex: 1,
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                marginRight: 32,
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <div style={{ flex: 1, marginRight: 16 }}>
                                <SummonerCollage player={player} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <StatsCard stats={player} hideName={true} />
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                                marginRight: 32,
                                alignItems: 'center',
                            }}
                        >
                            <h1
                                style={
                                    player.mmr
                                        ? {
                                              fontSize: 60,
                                              fontWeight: 'bold',
                                              color: getMmrColor(player.mmr),
                                              textShadow: '2px 2px 7px black',
                                          }
                                        : {
                                              fontSize: 30,
                                          }
                                }
                            >
                                {player.mmr
                                    ? Math.round(player.mmr)
                                    : 'Not Placed'}
                            </h1>
                            <h1>{'MMR'}</h1>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Radar data={chartData as any} />
                        </div>
                    </div>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Champion Overview</Tab>
                        <Tab>Teammate Record</Tab>
                        <Tab>Oppponent Record</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <SortableTable
                                columns={columns}
                                data={playerChampionData}
                                getRowProps={(row: any) => {
                                    return {
                                        onClick: () => {
                                            navigate(
                                                '/championOverview/' +
                                                    row.getValue('name')
                                            );
                                            window.scrollTo(0, 0);
                                        },
                                    };
                                }}
                            />
                        </TabPanel>
                        <TabPanel>
                            <SortableTable
                                columns={teammateColumns}
                                data={playerTeammateData}
                                getRowProps={(row: any) => {
                                    return {
                                        onClick: () => {
                                            navigate(
                                                '/playerOverview/' +
                                                    row.getValue('name')
                                            );
                                            window.scrollTo(0, 0);
                                        },
                                    };
                                }}
                            />
                        </TabPanel>
                        <TabPanel>
                            <SortableTable
                                columns={opponentColumns}
                                data={playerOpponentData}
                                getRowProps={(row: any) => {
                                    return {
                                        onClick: () => {
                                            navigate(
                                                '/playerOverview/' +
                                                    row.getValue('name')
                                            );
                                            window.scrollTo(0, 0);
                                        },
                                    };
                                }}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    );
});
