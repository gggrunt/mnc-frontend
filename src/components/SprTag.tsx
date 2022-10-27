import { Tag, TagLeftIcon } from '@chakra-ui/tag';
import { Player } from '../types/domain/Player';
import { getMmrColor, getMmrValue } from '../utils/mmrHelpers';
import { GiWingedSword } from 'react-icons/gi';
import { Text, Tooltip } from '@chakra-ui/react';

export const SprTag = ({
    player,
    props,
}: {
    player: Player;
    props?: { size?: string };
}) => {
    // TODO: Renable this for season 1
    //const rank = getMmrValue(player);
    //const playerIsRanked = rank > 0;
    const rank = 0;
    const playerIsRanked = false;

    return (
        <Tooltip label='Season Power Ranking (SPR) is a grade for player performance within a season'>
            <Tag
                textAlign='center'
                bg={getMmrColor(rank)}
                color={'gray.600'}
                size={props?.size}
                minW='100%'
            >
                <TagLeftIcon as={GiWingedSword}></TagLeftIcon>
                <Text minW='30px'>{playerIsRanked ? rank : '—'}</Text>
            </Tag>
        </Tooltip>
    );
};
