import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SortableTable } from '../components/SortableTable'
import { gameInfoSelector } from '../redux/gameInfo/gameInfoSelectors'
import { statsSelector } from '../redux/stats/statsSelectors'
import { Champion } from '../types/domain/Champion'
import { getChampionImage } from '../utils/championImageHelpers'

type ChampionOverviewChampion = {
    imageUrl: string
} & Champion

const columnHelper = createColumnHelper<ChampionOverviewChampion>()

const columns: ColumnDef<ChampionOverviewChampion, any>[] = [
    columnHelper.accessor((row) => row.name, {
        id: 'name',
        cell: (info) => {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={info.row.original.imageUrl}
                        style={{ width: 32, height: 32, marginRight: 8 }}
                    />
                    {info.getValue()}
                </div>
            )
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
]

export const ChampionOverview = React.memo(function ChampionOverview() {
    const navigate = useNavigate()
    const data = useSelector(statsSelector.getChampionsCollection)
    const championIdMap = useSelector(gameInfoSelector.getChampionMap)
    const processedChampionArray = Array.from(Object.values(data ?? [])).map(
        (champion) => {
            return {
                ...champion,
                imageUrl: championIdMap[champion.name]
                    ? getChampionImage(championIdMap[champion.name])
                    : '',
            }
        }
    )

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h1>Champion Overview</h1>
            <div style={{ maxWidth: 1024 }}>
                <SortableTable
                    columns={columns}
                    data={processedChampionArray}
                    getRowProps={(row: any) => {
                        return {
                            onClick: () => {
                                navigate(row.getValue('name'))
                            },
                        }
                    }}
                />
            </div>
        </div>
    )
})
