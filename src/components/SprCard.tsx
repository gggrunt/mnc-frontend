import {
    Box,
    Flex,
    Stat,
    StatArrow,
    StatHelpText,
    StatLabel,
    Tooltip,
} from '@chakra-ui/react';
import { FiMinus } from 'react-icons/fi';
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
        <Flex direction='column' align='center'>
            <Box>
                <Stat>
                    <Flex direction='column' align='center'>
                        <SprTag props={{ size: 'xl' }} player={player} />
                        <StatLabel fontSize='20'>SPR</StatLabel>
                        <Tooltip label='Average SPR change from recent games, up to the last five'>
                            <StatHelpText fontSize='14'>
                                {sprTrend !== 0 ? (
                                    <>
                                        <StatArrow
                                            type={
                                                sprTrend > 0
                                                    ? 'increase'
                                                    : 'decrease'
                                            }
                                        />
                                        {sprTrend}
                                    </>
                                ) : (
                                    '0 -'
                                )}
                            </StatHelpText>
                        </Tooltip>
                    </Flex>
                </Stat>
            </Box>
        </Flex>
    );
};
