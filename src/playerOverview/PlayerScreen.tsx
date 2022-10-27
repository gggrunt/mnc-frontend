import React, { ChangeEvent, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Error } from '../components/Error';
import { SortableTable } from '../components/SortableTable';
import { StatsCard } from '../components/StatsCard';
import { Champion } from '../types/domain/Champion';
import { Player, PlayerRecord } from '../types/domain/Player';
import {
    getChampionImage,
    getMatchWithImages,
} from '../utils/championImageHelpers';

import {
    Box,
    Flex,
    Heading,
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tooltip,
} from '@chakra-ui/react';
import { ChartData } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Loading } from '../components/Loading';
import { SprCard } from '../components/SprCard';
import { SummonerCollage } from '../components/SummonerCollage';
import { ChampionClass, championClassWinRates } from '../data/championClasses';
import {
    MatchWithImages,
    playerMatchHistoryColumns,
} from '../matchHistory/matchHistoryColumnHelper';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import { Match } from '../types/domain/Match';
import { PlayerMmrSummary } from './PlayerMmrSummary';
import {
    championColumns,
    opponentColumns,
    teammateColumns,
} from './playerScreenColumnHelper';
import { PlayerScreenChampion } from './types/PlayerScreenChampion';
import { AccoladesCollection } from '../components/AccoladesCollection';

export async function loader(data: { params: any }) {
    return data.params.playerId;
}

enum SeasonType {
    AllTime = 'all_time',
    SeasonOne = 'season_1',
}

const initialSeasonSelectValue = SeasonType.AllTime;

/**
 * Given a player, create an array of champions that player has played with image url populated
 * @param data
 */
const processPlayerChampions = (
    data: Player,
    championIdMap: { [key: string]: string }
): PlayerScreenChampion[] => {
    return (
        data.champions ? Array.from(Object.values(data.champions)) : []
    ).map((champion: Champion) => {
        return {
            ...champion,
            imageUrl: championIdMap[champion.name]
                ? getChampionImage(championIdMap[champion.name]).square
                : '',
        };
    });
};

function isPlayerMatchWinner(player: Player, match: Match) {
    return match.winner === 'Team 1'
        ? match.team1.players.findIndex(
              (matchPlayer) =>
                  matchPlayer.name.toLowerCase() === player.name.toLowerCase()
          ) > -1
        : match.team2.players.findIndex(
              (matchPlayer) =>
                  matchPlayer.name.toLowerCase() === player.name.toLowerCase()
          ) > -1;
}

export const PlayerScreen = React.memo(function PlayerScreen() {
    const navigate = useNavigate();
    const playerId = useLoaderData() as string;
    const playerResponse = ToxicDataService.usePlayer(playerId ?? '');
    const player = playerResponse.data;

    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    const matchHistoryResponse = ToxicDataService.useMatchHistory();
    const matchHistory = matchHistoryResponse.data ?? [];

    const [season, setSeason] = useState(initialSeasonSelectValue);

    // only recompute the player classes when are looking at a new player
    const playerClasses = useMemo(
        () => championClassWinRates(Object.values(player?.champions ?? {})),
        [player?.champions]
    );

    const chartLabels = Object.keys(ChampionClass).map((value) => {
        return value.toString();
    });

    const chartData: ChartData<'radar', (number | null)[], unknown> = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Wins',
                data: Object.values(playerClasses).map((value) => value.wins),
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Total Games',
                data: Object.values(playerClasses).map(
                    (value) => value.losses + value.wins
                ),
                fill: true,
                backgroundColor: 'rgba(99, 132, 255, 0.5)',
                borderColor: 'rgb(99, 132, 255, 0.5)',
                pointBackgroundColor: 'rgb(99, 132, 255)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(99, 132, 225)',
            },
        ],
    };

    if (playerResponse.isError) {
        return <Error error={'Something went wrong! Try again later.'} />;
    }

    if (playerResponse.isLoading) {
        return <Loading />;
    }

    if (player === undefined) {
        return <Error error={'Player not found!'} />;
    }

    const playerChampionData: Champion[] = processPlayerChampions(
        player,
        championIdMap
    );

    const playerMatchHistory: MatchWithImages[] = matchHistory
        .filter((match) => {
            return (
                match.team1.players.findIndex(
                    (matchPlayer) =>
                        matchPlayer.name.toLowerCase() ===
                        player.name.toLowerCase()
                ) > -1 ||
                match.team2.players.findIndex(
                    (matchPlayer) =>
                        matchPlayer.name.toLowerCase() ===
                        player.name.toLowerCase()
                ) > -1
            );
        })
        .map((match) => {
            return {
                ...getMatchWithImages(match, championIdMap),
                winner: isPlayerMatchWinner(player, match) ? 'WIN' : 'LOSS',
                playerName: player.name,
            };
        });

    const playerTeammateData: PlayerRecord[] = Object.values(
        player.teammates ?? []
    );
    const playerOpponentData: PlayerRecord[] = Object.values(
        player.opponents ?? []
    );

    const onSeasonChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSeason(event.target.value as SeasonType);
    };

    return (
        <Flex direction='column' justify='center' align='center'>
            <Flex
                flex='1'
                marginBottom='8'
                direction='column'
                justify='center'
                align='center'
            >
                <Heading fontStyle='italic'>
                    {player.name.toUpperCase()}
                </Heading>
                <Flex
                    direction='row'
                    justify='center'
                    alignSelf='stretch'
                    flex='1'
                    wrap='wrap'
                >
                    <Flex
                        direction='row'
                        wrap='wrap'
                        justify='center'
                        alignItems='center'
                    >
                        <Flex
                            margin='4'
                            flexGrow='1'
                            justifyContent='center'
                            maxWidth='320'
                            direction='column'
                        >
                            <Flex direction='row' marginBottom='4'>
                                <SummonerCollage player={player} />
                                <Box marginLeft={4}>
                                    <StatsCard stats={player} hideName={true} />
                                </Box>
                            </Flex>
                            <AccoladesCollection player={player} />
                        </Flex>
                        <Flex margin='4' justifyContent='center'>
                            {
                                // TODO: For season 1, we need to add the SPR rank here
                            }
                            <SprCard player={player} sprTrend={0} />
                        </Flex>
                        <Flex margin='4' flex='1' maxWidth='320'>
                            <Radar data={chartData} />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Select
                defaultValue={initialSeasonSelectValue}
                maxWidth={250}
                onChange={onSeasonChange}
            >
                {
                    // add back in option for season 1 once season 1 launches
                    // <option value={SeasonType.SeasonOne}>{'Season 1'}</option>
                }
                <option value={SeasonType.AllTime}>{'All Seasons'}</option>
            </Select>
            <Tabs isFitted={true} maxWidth='100%'>
                <TabList>
                    <Tab>Champion Overview</Tab>
                    <Tab>Match History</Tab>
                    {
                        // only show MMR summary for all time
                        season === 'all_time' ? <Tab>MMR Summary</Tab> : null
                    }
                    <Tab>Teammate Record</Tab>
                    <Tab>Opponent Record</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SortableTable
                            columns={championColumns}
                            data={playerChampionData}
                            getRowProps={(row: any) => {
                                return {
                                    onClick: () => {
                                        navigate(
                                            '/championOverview/' +
                                                row.getValue('name')
                                        );
                                        window.scrollTo(0, 0);
                                    },
                                };
                            }}
                        />
                    </TabPanel>
                    <TabPanel>
                        <SortableTable
                            columns={playerMatchHistoryColumns}
                            data={playerMatchHistory}
                            getRowProps={(row: any) => {
                                return {
                                    onClick: () => {
                                        navigate(
                                            '/matchHistory/' + row.original.id
                                        );
                                        window.scrollTo(0, 0);
                                    },
                                };
                            }}
                        />
                    </TabPanel>
                    {
                        // only show MMR summary for all time
                        season === 'all_time' ? (
                            <TabPanel>
                                <PlayerMmrSummary player={player} />
                            </TabPanel>
                        ) : null
                    }
                    <TabPanel>
                        <SortableTable
                            columns={teammateColumns}
                            data={playerTeammateData}
                            getRowProps={(row: any) => {
                                return {
                                    onClick: () => {
                                        navigate(
                                            '/playerOverview/' +
                                                row.getValue('name')
                                        );
                                        window.scrollTo(0, 0);
                                    },
                                };
                            }}
                        />
                    </TabPanel>
                    <TabPanel>
                        <SortableTable
                            columns={opponentColumns}
                            data={playerOpponentData}
                            getRowProps={(row: any) => {
                                return {
                                    onClick: () => {
                                        navigate(
                                            '/playerOverview/' +
                                                row.getValue('name')
                                        );
                                        window.scrollTo(0, 0);
                                    },
                                };
                            }}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
});
