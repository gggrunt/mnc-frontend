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
    return data.params.championId
}

type ChampionPlayer = {
    name: string
    wins: number
    losses: number
    winPercentage: number
    totalGames: number
}

/**
 * Given a champion, create an array of players that have played that champion
 * @param data
 */
const processChampionPlayers = (
    champion: Champion | undefined,
    allPlayers: Player[] | undefined
): ChampionPlayer[] => {
    if (champion === undefined || allPlayers === undefined) {
        return []
    }

    const championPlayers: ChampionPlayer[] = []

    for (const player of allPlayers) {
        if (player.champions) {
            const champDataForPlayer = player.champions[champion.name]
            if (champDataForPlayer) {
                // copy over the player's champion record, except replace the champion name with their name
                championPlayers.push({
                    ...champDataForPlayer,
                    name: player.name,
                })
            }
        }
    }
    return championPlayers
}

const columnHelper = createColumnHelper<ChampionPlayer>()

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

export const ChampionScreen = React.memo(function ChampionScreen() {
    const navigate = useNavigate()
    const championId = useLoaderData() as string
    const champion = useSelector((state: AppState) =>
        statsSelector.getChampion(state, championId ?? '')
    )
    const allPlayers = useSelector(statsSelector.getPlayersCollection)
    const dataDragonChampionIdMap = useSelector(gameInfoSelector.getChampionMap)
    const dataDragonChampionId = dataDragonChampionIdMap[championId]

    const championPlayerData: Player[] = processChampionPlayers(
        champion,
        allPlayers
    )

    if (champion === undefined) {
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
                <h1 style={{ color: 'white' }}>Champion not found</h1>
            </div>
        )
    }

    const statsCardChampion = {
        ...champion,
        imageUri: getChampionImage(dataDragonChampionId),
    }

    console.log(statsCardChampion.imageUri)

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
                <StatsCard stats={statsCardChampion} />
            </div>
            <div style={{ maxWidth: 1024 }}>
                <SortableTable
                    columns={columns}
                    data={championPlayerData}
                    getRowProps={(row: any) => {
                        return {
                            onClick: () => {
                                navigate(
                                    '/playerOverview/' + row.getValue('name')
                                )
                            },
                        }
                    }}
                />
            </div>
        </div>
    )
})
