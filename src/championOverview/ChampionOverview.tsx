import { Flex, Heading } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SortableTable } from '../components/SortableTable';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import { Champion } from '../types/domain/Champion';
import { getChampionImage } from '../utils/championImageHelpers';

type ChampionOverviewChampion = {
    imageUrl: string;
} & Champion;

const columnHelper = createColumnHelper<ChampionOverviewChampion>();

const columns: ColumnDef<ChampionOverviewChampion, any>[] = [
    columnHelper.accessor((row) => row.name, {
        id: 'name',
        cell: (info) => {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        alt='champion icon'
                        src={info.row.original.imageUrl}
                        style={{ width: 32, height: 32, marginRight: 8 }}
                    />
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
    columnHelper.accessor((row) => row.pickPercentage, {
        id: 'Pick Rate',
        cell: (info) => `${info.getValue()}%`,
        header: () => <span>Pick %</span>,
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor((row) => row.banPercentage, {
        id: 'Ban Rate',
        cell: (info) => `${info.getValue()}%`,
        header: () => <span>Ban %</span>,
        meta: {
            isNumeric: true,
        },
    }),
];

export const ChampionOverview = React.memo(function ChampionOverview() {
    const navigate = useNavigate();

    const championsResponse = ToxicDataService.useChampions();
    const champions = championsResponse.data;

    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    const processedChampionArray = Array.from(
        Object.values(champions ?? {})
    ).map((champion) => {
        return {
            ...champion,
            imageUrl: championIdMap[champion.name]
                ? getChampionImage(championIdMap[champion.name]).square
                : '',
        };
    });

    return (
        <Flex direction='column' justify='center' align='center'>
            <Heading>Champion Overview</Heading>
            <SortableTable
                columns={columns}
                data={processedChampionArray}
                getRowProps={(row: any) => {
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
