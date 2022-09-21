import React from 'react'

export const StatsCard = React.memo(function StatsCard({
    stats,
}: {
    stats: {
        name?: string
        wins?: number
        losses?: number
        extraStats?: string[]
        imageUri?: string
    }
}) {
    // there can be no missing fields here
    if (
        stats.name === undefined ||
        stats.wins === undefined ||
        stats.losses === undefined
    ) {
        return null
    }

    const totalGames = stats.wins + stats.losses
    const winPercentage = Math.round((stats.wins / totalGames) * 100)

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
            }}
        >
            <div style={{ flex: 1, display: 'flex', marginRight: 16 }}>
                <img src={stats.imageUri} />
            </div>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 500,
                }}
            >
                <h1>{stats.name}</h1>
                <h1>{'Wins: ' + stats.wins}</h1>
                <h1>{'Losses: ' + stats.losses}</h1>
                <h1>{'Win Percentage: ' + winPercentage + '%'}</h1>
                <h1>{'Total Games: ' + totalGames}</h1>
                {stats.extraStats
                    ? stats.extraStats.map((stat: string) => <h1>{stat}</h1>)
                    : null}
            </div>
        </div>
    )
})
