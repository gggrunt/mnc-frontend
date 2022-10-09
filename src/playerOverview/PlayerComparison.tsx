import React, { useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Error } from '../components/Error';
import { SortableTable } from '../components/SortableTable';
import { StatsCard } from '../components/StatsCard';
import { Champion } from '../types/domain/Champion';
import { Player, PlayerRecord } from '../types/domain/Player';
import {
    getChampionImage,
    getMatchWithImages,
} from '../utils/championImageHelpers';

import {
    Box,
    Flex,
    Heading,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react';
import { ChartData } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Loading } from '../components/Loading';
import { MmrCard } from '../components/MmrCard';
import { SummonerCollage } from '../components/SummonerCollage';
import { ChampionClass, championClassWinRates } from '../data/championClasses';
import {
    MatchWithImages,
    playerMatchHistoryColumns,
} from '../matchHistory/matchHistoryColumnHelper';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import { Match } from '../types/domain/Match';
import { PlayerMmrSummary } from './PlayerMmrSummary';
import {
    championColumns,
    opponentColumns,
    teammateColumns,
} from './playerScreenColumnHelper';
import { PlayerScreenChampion } from './types/PlayerScreenChampion';
import { ColumnDef, createColumnHelper, Row } from '@tanstack/react-table';

export async function loader(data: { params: any }) {
    return {
        player1Id: data.params.player1Id,
        player2Id: data.params.player2Id,
    };
}

/**
 * Given a player, create an array of champions that player has played with image url populated
 * @param data
 */
function processPlayerChampions(
    data: Player,
    championIdMap: { [key: string]: string }
): PlayerScreenChampion[] {
    return (
        data.champions ? Array.from(Object.values(data.champions)) : []
    ).map((champion: Champion) => {
        return {
            ...champion,
            imageUrl: championIdMap[champion.name]
                ? getChampionImage(championIdMap[champion.name]).square
                : '',
        };
    });
}

type SharedChampionsTableData = {
    player1WinRate: number;
    player2WinRate: number;
    name: string;
    imageUrl: string;
};

function processSharedChampions(
    player1Champions: PlayerScreenChampion[],
    player2Champions: PlayerScreenChampion[],
    sharedPool: string[]
): SharedChampionsTableData[] {
    const result = [];
    for (const championName of sharedPool) {
        const p1Champ = player1Champions.find(
            (value) => value.name === championName
        );
        const p2Champ = player2Champions.find(
            (value) => value.name === championName
        );
        result.push({
            player1WinRate: p1Champ?.winPercentage ?? 0,
            player2WinRate: p2Champ?.winPercentage ?? 0,
            name: championName,
            imageUrl: p1Champ?.imageUrl ?? '',
        });
    }

    return result;
}

const columnHelper = createColumnHelper<SharedChampionsTableData>();

export const PlayerComparison = React.memo(function PlayerComparison() {
    const navigate = useNavigate();
    // we know that hte player1Id and player2Id should exist on this page
    const { player1Id, player2Id } = useLoaderData() as any;

    const player1Response = ToxicDataService.usePlayer(player1Id ?? '');
    const player1 = player1Response.data;

    const player2Response = ToxicDataService.usePlayer(player2Id ?? '');
    const player2 = player2Response.data;

    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    if (player1Response.isError || player2Response.isError) {
        return <Error error={'Something went wrong! Try again later.'} />;
    }

    if (player2Response.isLoading || player2Response.isLoading) {
        return <Loading />;
    }

    if (player1 === undefined || player2 === undefined) {
        return <Error error={'Player not found!'} />;
    }

    const player1ChampionData: PlayerScreenChampion[] = processPlayerChampions(
        player1,
        championIdMap
    );

    const player2ChampionData: PlayerScreenChampion[] = processPlayerChampions(
        player2,
        championIdMap
    );

    // get the shared champions names between player 1 and player 2
    const sharedChampions: string[] = [];
    for (const champion of player1ChampionData) {
        if (
            player2ChampionData.findIndex(
                (champ) => champ.name === champion.name
            ) > -1
        ) {
            sharedChampions.push(champion.name);
        }
    }

    const processedData = processSharedChampions(
        player1ChampionData,
        player2ChampionData,
        sharedChampions
    );

    const player1TotalGames = (player1.wins ?? 0) + (player1.losses ?? 0);
    const player2TotalGames = (player2.wins ?? 0) + (player2.losses ?? 0);

    const columns: ColumnDef<SharedChampionsTableData, any>[] = [
        columnHelper.accessor((row) => row.player1WinRate, {
            id: 'p1winRate',
            cell: (info) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <h1 style={{ alignSelf: 'center', marginRight: 4 }}>
                        {info.getValue()}
                    </h1>
                    <div
                        style={{
                            width: `${info.getValue()}%`,
                            height: 32,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderTopLeftRadius: 4,
                            borderBottomLeftRadius: 4,
                        }}
                    />
                </div>
            ),
            header: () => <span>{player1.name}</span>,
            meta: {
                isNumeric: true,
            },
        }),
        columnHelper.accessor((row) => row.name, {
            id: 'name',
            cell: (info) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                display: 'flex',
                            }}
                        >
                            <img
                                alt='champion icon'
                                src={info.row.original.imageUrl}
                                style={{
                                    width: 32,
                                    height: 32,
                                    marginRight: 8,
                                }}
                            />
                        </div>
                        <h1 style={{ flex: 1 }}>{info.getValue()}</h1>
                    </div>
                );
            },
            header: () => <span>{'Champion'}</span>,
        }),
        columnHelper.accessor((row) => row.player2WinRate, {
            id: 'p2winRate',
            cell: (info) => (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div
                        style={{
                            width: `${info.getValue()}%`,
                            height: 32,
                            backgroundColor: 'rgb(99, 132, 255)',
                            borderTopRightRadius: 4,
                            borderBottomRightRadius: 4,
                        }}
                    />
                    <h1 style={{ alignSelf: 'center', marginLeft: 4 }}>
                        {info.getValue()}
                    </h1>
                </div>
            ),
            header: () => <span>{player2.name}</span>,
            meta: {
                isNumeric: true,
            },
        }),
    ];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Flex
                direction='row'
                justifyContent={'space-between'}
                minWidth={500}
                marginBottom={8}
            >
                <Flex direction='column' alignItems='center'>
                    <h1>{player1.name}</h1>
                    <SummonerCollage player={player1} />
                    <h1>{`Total Games: ${player1TotalGames}`}</h1>
                    <h1>{`Win Percentage: ${Math.round(
                        ((player1.wins ?? 0) / player1TotalGames) * 100
                    )}%`}</h1>
                    <h1>{`Wins: ${player1.wins}`}</h1>
                </Flex>
                <Flex direction='column' alignItems='center'>
                    <h1>{player2.name}</h1>
                    <SummonerCollage player={player2} />
                    <h1>{`Total Games: ${player2TotalGames}`}</h1>
                    <h1>{`Win Percentage: ${Math.round(
                        ((player2.wins ?? 0) / player2TotalGames) * 100
                    )}%`}</h1>
                    <h1>{`Wins: ${player2.wins}`}</h1>
                </Flex>
            </Flex>
            <Flex direction='column' minWidth={900}>
                <SortableTable
                    columns={columns}
                    data={processedData}
                    getRowProps={(row: Row<any>) => {
                        return {
                            onClick: () => {
                                navigate(
                                    `/championOverview/${row.getValue('name')}`
                                );
                                window.scrollTo(0, 0);
                            },
                        };
                    }}
                />
            </Flex>
        </div>
    );
});
