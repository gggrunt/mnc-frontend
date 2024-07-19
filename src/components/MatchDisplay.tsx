import { Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChampionImages } from '../types/domain/ChampionImages';
import { DirtyWordCleaner } from '../utils/DirtyWordCleaner';

export type MatchDisplayChampion = {
    name: string;
    images: ChampionImages;
};

export type MatchDisplayPlayer = {
    name: string;
    champion: MatchDisplayChampion;
};

const MatchPlayerCard = React.memo(
    ({
        player,
        textColor,
        backgroundColor,
        borderColor,
    }: {
        player: MatchDisplayPlayer;
        textColor?: string;
        backgroundColor?: string;
        borderColor?: string;
    }) => {
        const navigate = useNavigate();

        const championNav = useCallback(() => {
            navigate('/championOverview/' + player.champion.name);
        }, [navigate, player.champion.name]);

        const playerNav = useCallback(() => {
            navigate('/playerOverview/' + player.name.toLowerCase());
        }, [navigate, player.name]);

        return (
            <Flex
                flex={1}
                align={'center'}
                flexDirection={'column'}
                paddingRight={4}
                minWidth={160}
                maxWidth={180}
            >
                <Button
                    variant='ghost'
                    onClick={championNav}
                    flex={1}
                    padding={1}
                    size='md'
                >
                    {player.champion.images.portrait.indexOf('undefined') ===
                    -1 ? (
                        <Image src={player.champion.images.portrait} />
                    ) : null}
                </Button>
                {player.name !== '' ? (
                    <Button
                        variant='ghost'
                        onClick={playerNav}
                        alignSelf={'stretch'}
                        backgroundColor={backgroundColor}
                        borderColor={borderColor}
                        borderWidth={borderColor ? 5 : undefined}
                        size='md'
                    >
                        <Text
                            style={{
                                fontStyle: 'italic',
                                fontWeight: 'bold',
                                color: textColor,
                            }}
                            onClick={playerNav}
                        >
                            {DirtyWordCleaner(
                                player.name.toLowerCase()
                            ).toUpperCase()}
                        </Text>
                    </Button>
                ) : null}
            </Flex>
        );
    }
);

const BannedChampion = React.memo(
    ({ champion }: { champion: MatchDisplayChampion }) => {
        const navigate = useNavigate();

        const championNav = useCallback(() => {
            navigate('/championOverview/' + champion.name);
        }, [navigate, champion.name]);

        return (
            <Flex width={12} height={12} justify={'center'} marginRight={2}>
                <Button
                    variant='ghost'
                    onClick={championNav}
                    padding={1}
                    flex={1}
                    size='sm'
                >
                    <Image
                        src={champion.images.square}
                        objectFit={'cover'}
                        onClick={championNav}
                    />
                </Button>
            </Flex>
        );
    }
);

const TEAM_1_COLOR = 'rgb(99, 132, 255)';
const TEAM_2_COLOR = 'rgb(255, 99, 132)';

export const MatchDisplay = React.memo(function MatchDisplay({
    team1,
    team2,
    team1Bans,
    team2Bans,
    team1Label,
    team2Label,
    title,
    casterMode,
}: {
    team1: MatchDisplayPlayer[];
    team2: MatchDisplayPlayer[];
    team1Bans: MatchDisplayChampion[];
    team2Bans: MatchDisplayChampion[];
    team1Label: string;
    team2Label: string;
    title?: string;
    casterMode?: boolean;
}) {
    const team1Cards = team1.map((player, index) => {
        return (
            <MatchPlayerCard
                player={player}
                textColor={casterMode ? 'white' : undefined}
                backgroundColor={casterMode ? 'rgb(0,0,0,0.8)' : undefined}
                borderColor={casterMode ? TEAM_1_COLOR : undefined}
                key={'MatchPlayerCard1_' + index}
            />
        );
    });

    const team1BansCards = team1Bans.map((champion, index) => {
        return (
            <BannedChampion
                champion={champion}
                key={'BannedChampion1_' + index}
            />
        );
    });

    const team2Cards = team2.map((player, index) => {
        return (
            <MatchPlayerCard
                player={player}
                textColor={casterMode ? 'white' : undefined}
                backgroundColor={casterMode ? 'rgb(0,0,0,0.8)' : undefined}
                borderColor={casterMode ? TEAM_2_COLOR : undefined}
                key={'MatchPlayerCard2_' + index}
            />
        );
    });

    const team2BansCards = team2Bans.map((champion, index) => {
        return (
            <BannedChampion
                champion={champion}
                key={'BannedChampion2_' + index}
            />
        );
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Heading>{title}</Heading>
            <Flex direction={'column'}>
                <h1
                    style={{
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        fontSize: 24,
                        color: TEAM_1_COLOR,
                    }}
                >
                    {team1Label}
                </h1>
                <Flex
                    direction={'row'}
                    flex={1}
                    marginBottom={8}
                    flexWrap={'wrap'}
                >
                    {team1Cards}
                    <Flex
                        direction={'column'}
                        flex={1}
                        justifyContent={'flex-start'}
                    >
                        <h1
                            style={{
                                fontStyle: 'italic',
                                fontWeight: 'bold',
                                fontSize: 20,
                                color: TEAM_1_COLOR,
                            }}
                        >
                            BANS
                        </h1>
                        <Flex
                            direction={'row'}
                            flexWrap={'wrap'}
                            marginBottom={2}
                        >
                            {team1BansCards.slice(0, 3)}
                        </Flex>
                        <Flex direction={'row'} flexWrap={'wrap'}>
                            {team1BansCards.slice(3, 5)}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex direction={'column'}>
                <h1
                    style={{
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        fontSize: 24,
                        color: TEAM_2_COLOR,
                    }}
                >
                    {team2Label}
                </h1>
                <Flex
                    direction={'row'}
                    flex={1}
                    marginBottom={8}
                    flexWrap={'wrap'}
                >
                    {team2Cards}
                    <Flex
                        direction={'column'}
                        flex={1}
                        justifyContent={'flex-start'}
                    >
                        <h1
                            style={{
                                fontStyle: 'italic',
                                fontWeight: 'bold',
                                fontSize: 20,
                                color: TEAM_2_COLOR,
                            }}
                        >
                            BANS
                        </h1>
                        <Flex
                            direction={'row'}
                            flexWrap={'wrap'}
                            marginBottom={2}
                        >
                            {team2BansCards.slice(0, 3)}
                        </Flex>
                        <Flex direction={'row'} flexWrap={'wrap'}>
                            {team2BansCards.slice(3, 5)}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
});
