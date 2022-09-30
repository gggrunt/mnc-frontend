import { useEffect, useMemo, useState } from 'react';
import { getMmrColor } from '../../utils/mmrColorHelpers';

import CSS from 'csstype';
import { Player } from '../../types/domain/Player';
import { SummonerCollage } from '../../components/SummonerCollage';
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
import {
    ChampionClass,
    championClassWinRates,
} from '../../data/championClasses';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const styles = {
    header: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 64,
        color: 'white',
        marginBottom: 32,
        textAlign: 'center',
    } as any,
    content: {
        padding: '32px',
        height: '720px',
        maxWidth: '1024px',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    } as any,
};

export const PlayerCard = (props: { player: Player }) => {
    const mmrTextStyle: CSS.Properties = {
        fontSize: '60px',
        fontWeight: 'bold',
        color: getMmrColor(props.player.mmr ?? 0),
        textShadow: '2px 2px 7px black',
        textAlign: 'start',
    };

    const wins = Math.round(props.player.wins ?? 0);
    const losses = Math.round(props.player.losses ?? 0);

    const playerClasses = useMemo(
        () =>
            championClassWinRates(Object.values(props.player.champions ?? {})),
        [props.player]
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
                    backgroundColor: 'rgba(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)',
                    borderWidth: 5,
                },
                {
                    label: 'Total Games',
                    data: Object.values(playerClasses).map(
                        (value) => value.losses + value.wins
                    ),
                    fill: true,
                    backgroundColor: 'rgba(0, 0, 255)',
                    borderColor: 'rgb(0, 0, 255)',
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(99, 132, 225)',
                    borderWidth: 5,
                },
            ],
        });
    }, [playerClasses]);

    return (
        <div style={{ ...styles.content, marginLeft: 64 }}>
            <h1 style={{ ...styles.header, textAlign: 'start' }}>
                {props.player.name.toUpperCase()}
            </h1>
            <div style={{ flex: 1, flexDirection: 'row', display: 'flex' }}>
                <div
                    style={{
                        width: 500,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Radar
                        data={chartData as any}
                        options={{
                            scales: {
                                Radar: {
                                    grid: {
                                        color: 'white',
                                        lineWidth: 2,
                                    },
                                    pointLabels: {
                                        color: 'white',
                                        font: {
                                            size: 18,
                                        },
                                    },
                                    ticks: {
                                        backdropColor: 'transparent',
                                        callback: function () {
                                            return '';
                                        },
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: 'white',
                                        font: {
                                            size: 18,
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        paddingLeft: 32,
                    }}
                >
                    <div
                        style={{
                            width: 128,
                            height: 128,
                            marginBottom: 64 + 64,
                        }}
                    >
                        <SummonerCollage player={props.player} />
                    </div>
                    <h1
                        style={{
                            textDecoration: 'underline',
                            color: 'white',
                            fontSize: 40,
                            fontFamily: 'bahnschrift, sans-serif',
                        }}
                    >
                        MMR
                    </h1>
                    <h1 style={mmrTextStyle}>
                        {Math.round(props.player.mmr ?? 0)}
                    </h1>
                    <h1
                        style={{
                            textDecoration: 'underline',
                            color: 'white',
                            fontSize: 40,
                            fontFamily: 'bahnschrift, sans-serif',
                        }}
                    >
                        WIN-LOSS
                    </h1>
                    <h1
                        style={{
                            color: 'white',
                            fontSize: 38,
                            fontFamily: 'bahnschrift, sans-serif',
                        }}
                    >
                        {`${wins} - ${losses} (${Math.round(
                            (wins / (losses + wins)) * 100
                        )}%)`}
                    </h1>
                </div>
            </div>
        </div>
    );
};
