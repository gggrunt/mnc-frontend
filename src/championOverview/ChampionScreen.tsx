import { Flex } from '@chakra-ui/layout';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Error } from '../components/Error';
import { Loading } from '../components/Loading';
import { SortableTable } from '../components/SortableTable';
import { StatsCard } from '../components/StatsCard';
import { ChampionClassMap } from '../data/championClasses';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import { Champion } from '../types/domain/Champion';
import { Player } from '../types/domain/Player';
import { Seasons } from '../types/domain/Season';
import { getChampionImage } from '../utils/championImageHelpers';
import { ChampionPickBanView } from './ChampionPickBanView';

export async function loader(data: { params: any }) {
    return data.params.championId;
}

type ChampionPlayer = {
    name: string;
    wins: number;
    losses: number;
    winPercentage: number;
    totalGames: number;
};

/**
 * Given a champion, create an array of players that have played that champion
 * @param data
 */
const processChampionPlayers = (
    champion: Champion | undefined,
    allPlayers: Player[] | undefined
): ChampionPlayer[] => {
    if (champion === undefined || allPlayers === undefined) {
        return [];
    }

    const championPlayers: ChampionPlayer[] = [];

    for (const player of allPlayers) {
        if (player.champions) {
            const champDataForPlayer = player.champions[champion.name];
            if (champDataForPlayer) {
                // copy over the player's champion record, except replace the champion name with their name
                championPlayers.push({
                    ...champDataForPlayer,
                    name: player.name,
                });
            }
        }
    }
    return championPlayers;
};

const columnHelper = createColumnHelper<ChampionPlayer>();

const columns: ColumnDef<ChampionPlayer, any>[] = [
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
];

export const ChampionScreen = React.memo(function ChampionScreen() {
    const navigate = useNavigate();
    const championId = useLoaderData() as string;
    const championResponse = ToxicDataService.useChampion(championId ?? '');
    const champion = championResponse.data;

    const playersResponse = ToxicDataService.usePlayers();
    const players = playersResponse.data ?? [];

    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    const dataDragonChampionId = championIdMap[championId];
    const championClass = champion ? ChampionClassMap[champion.name] : [];

    const championPlayerData: Player[] = processChampionPlayers(
        champion,
        players
    );

    if (playersResponse.isLoading) {
        return <Loading />;
    }

    if (champion === undefined) {
        return <Error error={'Champion not found!'} />;
    }

    const statsCardChampion = {
        ...champion,
        imageUri: getChampionImage(dataDragonChampionId).portrait,
        extraStats: {
            Class: championClass.reduce((prevValue, currentValue) => {
                return (prevValue !== '' ? prevValue + ',' : '') + currentValue;
            }, ''),
            'Ban Rate': champion.banPercentage
                ? `${Math.round(champion.banPercentage)}%`
                : 'N/A',
            'Pick Rate': champion.pickPercentage
                ? `${Math.round(champion.pickPercentage)}%`
                : 'N/A',
        },
    };

    return (
        <Flex direction='column' justify='center' align='center'>
            <Flex marginBottom={8}>
                <StatsCard stats={statsCardChampion} />
            </Flex>
            <Tabs isFitted={true} maxWidth='100%'>
                <TabList>
                    <Tab>Match History</Tab>
                    <Tab>Pick & Ban Record</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SortableTable
                            columns={columns}
                            data={championPlayerData}
                            getRowProps={(row: any) => {
                                return {
                                    onClick: () => {
                                        navigate(
                                            '/playerOverview/' +
                                                row.getValue('name')
                                        );
                                    },
                                };
                            }}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Flex minWidth={'600'}>
                            <ChampionPickBanView champion={champion} />
                        </Flex>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
});
