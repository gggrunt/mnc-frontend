import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { useSelector } from 'react-redux'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { SortableTable } from '../components/SortableTable'
import { StatsCard } from '../components/StatsCard'
import { gameInfoSelector } from '../redux/gameInfo/gameInfoSelectors'
import { AppState } from '../redux/rootReducer'
import { statsSelector } from '../redux/stats/statsSelectors'
import { Champion } from '../types/domain/Champion'
import { Player } from '../types/domain/Player'
import { getChampionImage } from '../utils/championImageHelpers'

export async function loader(data: { params: any }) {
    return data.params.playerId
}

type PlayerScreenChampion = {
    imageUrl: string
} & Champion

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
        console.log(champion)
        return {
            ...champion,
            imageUrl: championIdMap[champion.name]
                ? getChampionImage(championIdMap[champion.name])
                : '',
        }
    })
}

const columnHelper = createColumnHelper<PlayerScreenChampion>()

const columns: ColumnDef<PlayerScreenChampion, any>[] = [
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

export const PlayerScreen = React.memo(function PlayerScreen() {
    const navigate = useNavigate()
    const playerId = useLoaderData() as string
    const player: Player | undefined = useSelector((state: AppState) =>
        statsSelector.getPlayer(state, playerId ?? '')
    )

    const championIdMap = useSelector(gameInfoSelector.getChampionMap)

    if (player === undefined) {
        return (
            <div
                style={{
                    display: 'flex',
                    minHeight: '100vh',
                    backgroundColor: '#282c34',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <h1 style={{ color: 'white' }}>Player not found</h1>
            </div>
        )
    }

    const playerChampionData: Champion[] = processPlayerChampions(
        player,
        championIdMap
    )

    const statsCardPlayer = {
        ...player,
        extraStats: player.mmr ? ['MMR: ' + Math.round(player.mmr)] : [],
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={{ marginBottom: 32 }}>
                <StatsCard stats={statsCardPlayer} />
            </div>
            <div style={{ maxWidth: 1024 }}>
                <SortableTable
                    columns={columns}
                    data={playerChampionData}
                    getRowProps={(row: any) => {
                        return {
                            onClick: () => {
                                navigate(
                                    '/championOverview/' + row.getValue('name')
                                )
                            },
                        }
                    }}
                />
            </div>
        </div>
    )
})
