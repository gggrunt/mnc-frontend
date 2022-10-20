import { Flex } from '@chakra-ui/react';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { FiChevronDown, FiChevronUp, FiMinus } from 'react-icons/fi';
import { getMmrTrendingChange } from '../utils/mmrHelpers';

ChartJS.register(
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale,
    Filler,
    Tooltip,
    Legend
);

function processPlayerMmr(data: { gameId: number; mmr: number }[]): {
    result: { x: number; y: number }[];
    maxMmr: number;
    minMmr: number;
} {
    let minMmr = 2000;
    let maxMmr = 1000;
    const result = data.map((value) => {
        if (value.mmr > maxMmr) {
            maxMmr = value.mmr;
        }

        if (value.mmr < minMmr) {
            minMmr = value.mmr;
        }

        return { x: value.gameId, y: value.mmr };
    });

    return {
        result,
        minMmr,
        maxMmr,
    };
}

export const PlayerMmrSummary = React.memo(function PlayerMmrSummary({
    playerMmrHistory,
}: {
    playerMmrHistory: { gameId: number; mmr: number }[];
}) {
    // ignore the first 10 games since they are used for placement
    const playerMmrPerMatchSliced = playerMmrHistory.slice(9);

    const {
        result: data,
        minMmr,
        maxMmr,
    } = processPlayerMmr(playerMmrPerMatchSliced);

    const playerMmrPerMatchData = {
        datasets: [
            {
                data: data,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)',
            },
        ],
    };

    return (
        <Flex direction='column'>
            {playerMmrPerMatchSliced.length > 1 ? (
                <Line
                    data={playerMmrPerMatchData}
                    style={{ maxHeight: 300 }}
                    options={{
                        scales: {
                            x: {
                                type: 'linear',
                                min: playerMmrPerMatchSliced[0]?.gameId,
                                max: playerMmrPerMatchSliced[
                                    playerMmrPerMatchSliced.length - 1
                                ]?.gameId,
                            },
                            y: {
                                suggestedMin: minMmr - 50,
                                suggestedMax: maxMmr + 50,
                            },
                        },
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                    }}
                />
            ) : (
                <Flex direction='column' justify='center' align='center'>
                    <h1 style={{ fontSize: 30 }}>{`Not enough data.`}</h1>
                    <h1 style={{ fontSize: 30 }}>
                        {`Player needs to complete more games.`}
                    </h1>
                </Flex>
            )}
        </Flex>
    );
});
