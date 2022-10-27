import { Flex, Heading, Text } from '@chakra-ui/react';
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
                <Text>{'Wins: ' + stats.wins}</Text>
                <Text>{'Losses: ' + stats.losses}</Text>
                <Text>{'Win Percentage: ' + winPercentage + '%'}</Text>
                <Text>{'Total Games: ' + totalGames}</Text>
                {stats.extraStats !== undefined
                    ? Array.from(Object.entries(stats.extraStats)).map((kv) => (
                          <Flex direction='row' key={'flex' + kv[0]}>
                              <Text>{`${kv[0]}: ${kv[1]}`}</Text>
                          </Flex>
                      ))
                    : null}
            </Flex>
        </Flex>
    );
});
