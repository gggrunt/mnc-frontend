import {
    Box,
    Flex,
    Stat,
    StatArrow,
    StatHelpText,
    StatLabel,
    Tooltip,
} from '@chakra-ui/react';
import { Player } from '../types/domain/Player';
import { SprTag } from './SprTag';

export const SprCard = ({
    player,
    sprTrend,
}: {
    player: Player;
    sprTrend: number;
}) => {
    return (
        <Flex direction='column' flex='1' align='center'>
            <Box>
                <Stat>
                    <Flex direction='column' align='center'>
                        <SprTag props={{ size: 'xl' }} player={player} />
                        <StatLabel fontSize='20'>
                            Season Power Ranking
                        </StatLabel>
                        <Tooltip label='MMR change over recent games, up to the last five'>
                            <StatHelpText fontSize='14'>
                                <StatArrow
                                    type={
                                        sprTrend > 0 ? 'increase' : 'decrease'
                                    }
                                />
                                {sprTrend}
                            </StatHelpText>
                        </Tooltip>
                    </Flex>
                </Stat>
            </Box>
        </Flex>
    );
};