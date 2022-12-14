import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { Champion } from '../types/domain/Champion';
import { Player } from '../types/domain/Player';
import { getChampionImage } from '../utils/championImageHelpers';

export function getPlaceholderIcon() {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Profile_avatar_placeholder_large.png/120px-Profile_avatar_placeholder_large.png?20150327203541';
}

export function sortChampionsByWinRate(player: Player): Champion[] {
    if (!player.champions) {
        return [];
    }

    return Array.from(Object.values(player.champions)).sort(
        (a: Champion, b: Champion) =>
            b.winPercentage * b.totalGames - a.winPercentage * a.totalGames
    );
}

export const SummonerCollage = React.memo(function Error({
    player,
}: {
    player: Player;
}) {
    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    // get the player's 4 champions wih thte highest win rate
    const sortedChampions = sortChampionsByWinRate(player)
        .slice(0, 4)
        .map((value) => {
            const dataDragonChampionId = championIdMap[value.name];
            return {
                ...value,
                imageUri: getChampionImage(dataDragonChampionId).square,
            };
        });

    return (
        <Flex direction='column' borderColor={'red'} borderWidth={'5'}>
            <Flex direction='row'>
                {sortedChampions[0] ? (
                    <Box>
                        <img
                            alt='player champion icon 1'
                            style={{ flex: 1 }}
                            src={sortedChampions[0].imageUri}
                        />
                    </Box>
                ) : (
                    <Box>
                        <img
                            alt='random icon 1'
                            style={{ flex: 1 }}
                            src={getPlaceholderIcon()}
                        />
                    </Box>
                )}
                {sortedChampions[2] ? (
                    <Box>
                        <img
                            alt='player champion icon 2'
                            style={{ flex: 1 }}
                            src={sortedChampions[2].imageUri}
                        />
                    </Box>
                ) : (
                    <Box>
                        <img
                            alt='random icon 2'
                            style={{ flex: 1 }}
                            src={getPlaceholderIcon()}
                        />
                    </Box>
                )}
            </Flex>
            <Flex direction='row'>
                {sortedChampions[3] ? (
                    <Box>
                        <img
                            alt='player champion icon 3'
                            style={{ flex: 1 }}
                            src={sortedChampions[3].imageUri}
                        />
                    </Box>
                ) : (
                    <Box>
                        <img
                            alt='random icon 3'
                            style={{ flex: 1 }}
                            src={getPlaceholderIcon()}
                        />
                    </Box>
                )}
                {sortedChampions[1] ? (
                    <Box>
                        <img
                            alt='random champion icon 4'
                            style={{ flex: 1 }}
                            src={sortedChampions[1].imageUri}
                        />
                    </Box>
                ) : (
                    <Box>
                        <img
                            alt='random champion icon 4'
                            style={{ flex: 1 }}
                            src={getPlaceholderIcon()}
                        />
                    </Box>
                )}
            </Flex>
        </Flex>
    );
});
