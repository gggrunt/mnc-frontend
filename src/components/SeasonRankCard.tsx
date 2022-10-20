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
import { SeasonRankTag } from './SeasonRankTag';

export const SeasonRankCard = ({
    player,
    rankTrend,
}: {
    player: Player;
    rankTrend: number;
}) => {
    return (
        <Flex direction='column' flex='1' align='center'>
            <Box>
                <Stat>
                    <Flex direction='column' align='center'>
                        <SeasonRankTag props={{ size: 'xl' }} player={player} />
                        <StatLabel fontSize='20'>MMR</StatLabel>
                        <Tooltip label='MMR change over recent games, up to the last five'>
                            <StatHelpText fontSize='14'>
                                <StatArrow
                                    type={
                                        rankTrend > 0 ? 'increase' : 'decrease'
                                    }
                                />
                                {rankTrend}
                            </StatHelpText>
                        </Tooltip>
                    </Flex>
                </Stat>
            </Box>
        </Flex>
    );
};
