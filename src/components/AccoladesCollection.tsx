import { Flex } from '@chakra-ui/react';
import React from 'react';
import { GAME_100_BADGE, SEASON_0_BADGE } from '../data/accolades';
import { Player } from '../types/domain/Player';
import { AccoladeBadge } from './AccoladeBadge';

export const AccoladesCollection = React.memo(function AccoladesCollection({
    player,
}: {
    player: Player;
}) {
    {
        return (
            <Flex>
                {(player.losses ?? 0) + (player.wins ?? 0) > 10 ? (
                    <AccoladeBadge
                        title='PROJECT: KRAKEN'
                        description='Monday Night Customs Founding Member'
                        imageUri={SEASON_0_BADGE}
                    />
                ) : null}
                {(player.losses ?? 0) + (player.wins ?? 0) >= 100 ? (
                    <AccoladeBadge
                        title='100 GAMES'
                        description='Play 100 games of Monday Night Customs'
                        imageUri={GAME_100_BADGE}
                    />
                ) : null}
            </Flex>
        );
    }
});
