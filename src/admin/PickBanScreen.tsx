import { Flex, Input, Select } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Error } from '../components/Error';
import { Loading } from '../components/Loading';
import {
    MatchDisplay,
    MatchDisplayChampion,
    MatchDisplayPlayer,
} from '../components/MatchDisplay';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import {
    getChampionImage,
    getMatchWithImages,
} from '../utils/championImageHelpers';

const emptyArray: any[] = [];

type PickBanScreenUrlParams = {
    matchId: string;
    swapTeams: boolean;
};

export async function loader(data: { params: any }) {
    return {
        matchId: data.params.matchId,
        swapTeams: data.params.swap,
    };
}

export const PickBanScreen = React.memo(function PickBanScreen() {
    const pickBanScreenParams = useLoaderData() as PickBanScreenUrlParams;

    const playersResponse = ToxicDataService.usePlayers();
    const players = playersResponse.data ?? [];

    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    const matchHistoryResponse = ToxicDataService.useMatchHistory();
    const matchHistory = matchHistoryResponse.data ?? [];

    const [team1Player1, setTeam1Player1] = useState<string>();
    const [team1Player2, setTeam1Player2] = useState<string>();
    const [team1Player3, setTeam1Player3] = useState<string>();
    const [team1Player4, setTeam1Player4] = useState<string>();
    const [team1Player5, setTeam1Player5] = useState<string>();
    const [team2Player1, setTeam2Player1] = useState<string>();
    const [team2Player2, setTeam2Player2] = useState<string>();
    const [team2Player3, setTeam2Player3] = useState<string>();
    const [team2Player4, setTeam2Player4] = useState<string>();
    const [team2Player5, setTeam2Player5] = useState<string>();

    const [team1Champion1, setTeam1Champion1] = useState<string>();
    const [team1Champion2, setTeam1Champion2] = useState<string>();
    const [team1Champion3, setTeam1Champion3] = useState<string>();
    const [team1Champion4, setTeam1Champion4] = useState<string>();
    const [team1Champion5, setTeam1Champion5] = useState<string>();
    const [team2Champion1, setTeam2Champion1] = useState<string>();
    const [team2Champion2, setTeam2Champion2] = useState<string>();
    const [team2Champion3, setTeam2Champion3] = useState<string>();
    const [team2Champion4, setTeam2Champion4] = useState<string>();
    const [team2Champion5, setTeam2Champion5] = useState<string>();

    const [team1Ban1, setTeam1Ban1] = useState<string>();
    const [team1Ban2, setTeam1Ban2] = useState<string>();
    const [team1Ban3, setTeam1Ban3] = useState<string>();
    const [team1Ban4, setTeam1Ban4] = useState<string>();
    const [team1Ban5, setTeam1Ban5] = useState<string>();
    const [team2Ban1, setTeam2Ban1] = useState<string>();
    const [team2Ban2, setTeam2Ban2] = useState<string>();
    const [team2Ban3, setTeam2Ban3] = useState<string>();
    const [team2Ban4, setTeam2Ban4] = useState<string>();
    const [team2Ban5, setTeam2Ban5] = useState<string>();

    const setMatch = () => {
        const matchId = (document.getElementById('matchId') as any).value;
        const match = matchHistory.find((value) => value.id === matchId);

        if (match) {
            setTeam1Player1(match.team1.players[0].name);
            setTeam1Player2(match.team1.players[1].name);
            setTeam1Player3(match.team1.players[2].name);
            setTeam1Player4(match.team1.players[3].name);
            setTeam1Player5(match.team1.players[4].name);
            setTeam2Player1(match.team2.players[0].name);
            setTeam2Player2(match.team2.players[1].name);
            setTeam2Player3(match.team2.players[2].name);
            setTeam2Player4(match.team2.players[3].name);
            setTeam2Player5(match.team2.players[4].name);

            setTeam1Champion1(match.team1.players[0].champion.name);
            setTeam1Champion2(match.team1.players[1].champion.name);
            setTeam1Champion3(match.team1.players[2].champion.name);
            setTeam1Champion4(match.team1.players[3].champion.name);
            setTeam1Champion5(match.team1.players[4].champion.name);
            setTeam2Champion1(match.team2.players[0].champion.name);
            setTeam2Champion2(match.team2.players[1].champion.name);
            setTeam2Champion3(match.team2.players[2].champion.name);
            setTeam2Champion4(match.team2.players[3].champion.name);
            setTeam2Champion5(match.team2.players[4].champion.name);

            setTeam1Ban1(match.team1.bans[0].name);
            setTeam1Ban2(match.team1.bans[1].name);
            setTeam1Ban3(match.team1.bans[2].name);
            setTeam1Ban4(match.team1.bans[3].name);
            setTeam1Ban5(match.team1.bans[4].name);
            setTeam2Ban1(match.team2.bans[0].name);
            setTeam2Ban2(match.team2.bans[1].name);
            setTeam2Ban3(match.team2.bans[2].name);
            setTeam2Ban4(match.team2.bans[3].name);
            setTeam2Ban5(match.team2.bans[4].name);
        }
    };

    useEffect(() => {
        const match =
            pickBanScreenParams && pickBanScreenParams.matchId
                ? matchHistory.find(
                      (value) => value.id === pickBanScreenParams.matchId
                  )
                : undefined;

        if (match) {
            // check the swap teams parameter
            const team1 = pickBanScreenParams.swapTeams
                ? match.team2
                : match.team1;
            const team2 = pickBanScreenParams.swapTeams
                ? match.team1
                : match.team2;

            setTeam1Player1(team1.players[0].name);
            setTeam1Player2(team1.players[1].name);
            setTeam1Player3(team1.players[2].name);
            setTeam1Player4(team1.players[3].name);
            setTeam1Player5(team1.players[4].name);
            setTeam2Player1(team2.players[0].name);
            setTeam2Player2(team2.players[1].name);
            setTeam2Player3(team2.players[2].name);
            setTeam2Player4(team2.players[3].name);
            setTeam2Player5(team2.players[4].name);

            setTeam1Champion1(team1.players[0].champion.name);
            setTeam1Champion2(team1.players[1].champion.name);
            setTeam1Champion3(team1.players[2].champion.name);
            setTeam1Champion4(team1.players[3].champion.name);
            setTeam1Champion5(team1.players[4].champion.name);
            setTeam2Champion1(team2.players[0].champion.name);
            setTeam2Champion2(team2.players[1].champion.name);
            setTeam2Champion3(team2.players[2].champion.name);
            setTeam2Champion4(team2.players[3].champion.name);
            setTeam2Champion5(team2.players[4].champion.name);

            setTeam1Ban1(team1.bans[0].name);
            setTeam1Ban2(team1.bans[1].name);
            setTeam1Ban3(team1.bans[2].name);
            setTeam1Ban4(team1.bans[3].name);
            setTeam1Ban5(team1.bans[4].name);
            setTeam2Ban1(team2.bans[0].name);
            setTeam2Ban2(team2.bans[1].name);
            setTeam2Ban3(team2.bans[2].name);
            setTeam2Ban4(team2.bans[3].name);
            setTeam2Ban5(team2.bans[4].name);
        }
    }, [matchHistory, pickBanScreenParams]);

    const team1: MatchDisplayPlayer[] = [
        {
            name: team1Player1 ?? '',
            champion: {
                name: team1Champion1 ?? '',
                images: getChampionImage(championIdMap[team1Champion1 ?? '']),
            },
        },
        {
            name: team1Player2 ?? '',
            champion: {
                name: team1Champion2 ?? '',
                images: getChampionImage(championIdMap[team1Champion2 ?? '']),
            },
        },
        {
            name: team1Player3 ?? '',
            champion: {
                name: team1Champion3 ?? '',
                images: getChampionImage(championIdMap[team1Champion3 ?? '']),
            },
        },
        {
            name: team1Player4 ?? '',
            champion: {
                name: team1Champion4 ?? '',
                images: getChampionImage(championIdMap[team1Champion4 ?? '']),
            },
        },
        {
            name: team1Player5 ?? '',
            champion: {
                name: team1Champion5 ?? '',
                images: getChampionImage(championIdMap[team1Champion5 ?? '']),
            },
        },
    ];

    const team2: MatchDisplayPlayer[] = [
        {
            name: team2Player1 ?? '',
            champion: {
                name: team2Champion1 ?? '',
                images: getChampionImage(championIdMap[team2Champion1 ?? '']),
            },
        },
        {
            name: team2Player2 ?? '',
            champion: {
                name: team2Champion2 ?? '',
                images: getChampionImage(championIdMap[team2Champion2 ?? '']),
            },
        },
        {
            name: team2Player3 ?? '',
            champion: {
                name: team2Champion3 ?? '',
                images: getChampionImage(championIdMap[team2Champion3 ?? '']),
            },
        },
        {
            name: team2Player4 ?? '',
            champion: {
                name: team2Champion4 ?? '',
                images: getChampionImage(championIdMap[team2Champion4 ?? '']),
            },
        },
        {
            name: team2Player5 ?? '',
            champion: {
                name: team2Champion5 ?? '',
                images: getChampionImage(championIdMap[team2Champion5 ?? '']),
            },
        },
    ];

    const team1Bans: MatchDisplayChampion[] = [
        {
            name: team1Ban1 ?? '',
            images: getChampionImage(championIdMap[team1Ban1 ?? '']),
        },
        {
            name: team1Ban2 ?? '',
            images: getChampionImage(championIdMap[team1Ban2 ?? '']),
        },
        {
            name: team1Ban3 ?? '',
            images: getChampionImage(championIdMap[team1Ban3 ?? '']),
        },
        {
            name: team1Ban4 ?? '',
            images: getChampionImage(championIdMap[team1Ban4 ?? '']),
        },
        {
            name: team1Ban5 ?? '',
            images: getChampionImage(championIdMap[team1Ban5 ?? '']),
        },
    ];

    const team2Bans: MatchDisplayChampion[] = [
        {
            name: team2Ban1 ?? '',
            images: getChampionImage(championIdMap[team2Ban1 ?? '']),
        },
        {
            name: team2Ban2 ?? '',
            images: getChampionImage(championIdMap[team2Ban2 ?? '']),
        },
        {
            name: team2Ban3 ?? '',
            images: getChampionImage(championIdMap[team2Ban3 ?? '']),
        },
        {
            name: team2Ban4 ?? '',
            images: getChampionImage(championIdMap[team2Ban4 ?? '']),
        },
        {
            name: team2Ban5 ?? '',
            images: getChampionImage(championIdMap[team2Ban5 ?? '']),
        },
    ];

    useEffect(() => {
        document.title = 'Barghest';
    }, []);

    if (players.length === 0) {
        return null;
    }

    const playerOptions = players.map((player) => (
        <option value={player.name} label={player.name} />
    ));
    const championOptions = Object.keys(championIdMap).map((name) => (
        <option value={name} label={name} />
    ));

    return (
        <div
            style={{
                backgroundColor: 'magenta',
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                padding: 32,
            }}
        >
            <MatchDisplay
                team1Label={`TEAM 1`}
                team2Label={`TEAM 2`}
                team1={team1 ?? emptyArray}
                team2={team2 ?? emptyArray}
                team1Bans={team1Bans ?? emptyArray}
                team2Bans={team2Bans ?? emptyArray}
                casterMode={true}
            />
            <Flex
                direction={'column'}
                marginBottom={8}
                marginTop={32}
                backgroundColor={'white'}
            >
                <h1>TEAM 1 BANS: </h1>
                <Flex direction='row'>
                    <select
                        id={'t1b1select'}
                        onChange={(e) => {
                            setTeam1Ban1(
                                (document.getElementById('t1b1select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t1b2select'}
                        onChange={(e) => {
                            setTeam1Ban2(
                                (document.getElementById('t1b2select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t1b3select'}
                        onChange={(e) => {
                            setTeam1Ban3(
                                (document.getElementById('t1b3select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t1b4select'}
                        onChange={(e) => {
                            setTeam1Ban4(
                                (document.getElementById('t1b4select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t1b5select'}
                        onChange={(e) => {
                            setTeam1Ban5(
                                (document.getElementById('t1b5select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                </Flex>
                <h1>TEAM 1 PLAYERS: </h1>
                <Flex direction='row'>
                    <select
                        id={'t1c1select'}
                        onChange={(e) => {
                            setTeam1Champion1(
                                (document.getElementById('t1c1select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t1c2select'}
                        onChange={(e) => {
                            setTeam1Champion2(
                                (document.getElementById('t1c2select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t1c3select'}
                        onChange={(e) => {
                            setTeam1Champion3(
                                (document.getElementById('t1c3select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t1c4select'}
                        onChange={(e) => {
                            setTeam1Champion4(
                                (document.getElementById('t1c4select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t1c5select'}
                        onChange={(e) => {
                            setTeam1Champion5(
                                (document.getElementById('t1c5select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                </Flex>
                {pickBanScreenParams !== undefined ? (
                    <Flex direction='row'>
                        <select
                            id={'t1p1select'}
                            onChange={(e) => {
                                setTeam1Player1(
                                    (
                                        document.getElementById(
                                            't1p1select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                        <select
                            id={'t1p2select'}
                            onChange={(e) => {
                                setTeam1Player2(
                                    (
                                        document.getElementById(
                                            't1p2select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                        <select
                            id={'t1p3select'}
                            onChange={(e) => {
                                setTeam1Player3(
                                    (
                                        document.getElementById(
                                            't1p3select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                        <select
                            id={'t1p4select'}
                            onChange={(e) => {
                                setTeam1Player4(
                                    (
                                        document.getElementById(
                                            't1p4select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                        <select
                            id={'t1p5select'}
                            onChange={(e) => {
                                setTeam1Player5(
                                    (
                                        document.getElementById(
                                            't1p5select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                    </Flex>
                ) : null}
            </Flex>
            <Flex direction={'column'} backgroundColor={'white'}>
                <h1>TEAM 2 BANS: </h1>
                <Flex direction='row'>
                    <select
                        id={'t2b1select'}
                        onChange={(e) => {
                            setTeam2Ban1(
                                (document.getElementById('t2b1select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t2b2select'}
                        onChange={(e) => {
                            setTeam2Ban2(
                                (document.getElementById('t2b2select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t2b3select'}
                        onChange={(e) => {
                            setTeam2Ban3(
                                (document.getElementById('t2b3select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t2b4select'}
                        onChange={(e) => {
                            setTeam2Ban4(
                                (document.getElementById('t2b4select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t2b5select'}
                        onChange={(e) => {
                            setTeam2Ban5(
                                (document.getElementById('t2b5select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                </Flex>
                <h1>TEAM 2 PLAYERS: </h1>
                <Flex direction='row'>
                    <select
                        id={'t2c1select'}
                        onChange={(e) => {
                            setTeam2Champion1(
                                (document.getElementById('t2c1select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t2c2select'}
                        onChange={(e) => {
                            setTeam2Champion2(
                                (document.getElementById('t2c2select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t2c3select'}
                        onChange={(e) => {
                            setTeam2Champion3(
                                (document.getElementById('t2c3select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t2c4select'}
                        onChange={(e) => {
                            setTeam2Champion4(
                                (document.getElementById('t2c4select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                    <select
                        id={'t2c5select'}
                        onChange={(e) => {
                            setTeam2Champion5(
                                (document.getElementById('t2c5select') as any)
                                    .value
                            );
                        }}
                        style={{ width: 175 }}
                    >
                        {championOptions}
                    </select>
                </Flex>
                {pickBanScreenParams !== undefined ? (
                    <Flex direction='row'>
                        <select
                            id={'t2p1select'}
                            onChange={(e) => {
                                setTeam2Player1(
                                    (
                                        document.getElementById(
                                            't2p1select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                        <select
                            id={'t2p2select'}
                            onChange={(e) => {
                                setTeam2Player2(
                                    (
                                        document.getElementById(
                                            't2p2select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                        <select
                            id={'t2p3select'}
                            onChange={(e) => {
                                setTeam2Player3(
                                    (
                                        document.getElementById(
                                            't2p3select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                        <select
                            id={'t2p4select'}
                            onChange={(e) => {
                                setTeam2Player4(
                                    (
                                        document.getElementById(
                                            't2p4select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                        <select
                            id={'t2p5select'}
                            onChange={(e) => {
                                setTeam2Player5(
                                    (
                                        document.getElementById(
                                            't2p5select'
                                        ) as any
                                    ).value
                                );
                            }}
                            style={{ width: 175 }}
                        >
                            {playerOptions}
                        </select>
                    </Flex>
                ) : null}
            </Flex>
            <Flex
                borderWidth={1}
                borderColor={'black'}
                paddingTop={4}
                paddingBottom={4}
                backgroundColor={'white'}
            >
                <input
                    id={'matchId'}
                    type='text'
                    style={{
                        padding: 4,
                        borderWidth: 1,
                        borderColor: 'black',
                        margin: 2,
                    }}
                />
                <button
                    onClick={setMatch}
                    style={{
                        padding: 4,
                        borderWidth: 1,
                        borderColor: 'black',
                        margin: 2,
                    }}
                >
                    FETCH MATCH
                </button>
            </Flex>
        </div>
    );
});
