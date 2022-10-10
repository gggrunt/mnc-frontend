import { Flex, Heading } from '@chakra-ui/react';
import React from 'react';

export const StatsCard = React.memo(function StatsCard({
    stats,
    hideName,
}: {
    stats: {
        name?: string;
        wins?: number;
        losses?: number;
        extraStats?: { [id: string]: string };
        imageUri?: string;
    };
    hideName?: boolean;
}) {
    // there can be no missing fields here
    if (
        stats.name === undefined ||
        stats.wins === undefined ||
        stats.losses === undefined
    ) {
        return null;
    }

    const totalGames = stats.wins + stats.losses;
    const winPercentage = Math.round((stats.wins / totalGames) * 100);

    return (
        <Flex flex='1' direction='row' justify='space-evenly'>
            {stats.imageUri !== undefined ? (
                <Flex flex='1' marginRight='16'>
                    <img
                        alt=''
                        src={stats.imageUri}
                        style={{ objectFit: 'contain' }}
                    />
                </Flex>
            ) : null}
            <Flex flex='1' direction='column'>
                {hideName === true ? null : (
                    <Heading
                        color='bodyFont'
                        fontWeight='bold'
                        fontStyle='italic'
                    >
                        {stats.name.toUpperCase()}
                    </Heading>
                )}
                <h1>{'Wins: ' + stats.wins}</h1>
                <h1>{'Losses: ' + stats.losses}</h1>
                <h1>{'Win Percentage: ' + winPercentage + '%'}</h1>
                <h1>{'Total Games: ' + totalGames}</h1>
                {stats.extraStats !== undefined
                    ? Array.from(Object.entries(stats.extraStats)).map((kv) => (
                          <Flex direction='row'>
                              <h1>{`${kv[0]}: ${kv[1]}`}</h1>
                          </Flex>
                      ))
                    : null}
            </Flex>
        </Flex>
    );
});
