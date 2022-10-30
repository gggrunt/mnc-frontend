import { Flex, Heading, Select, Tag, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
    ChampionAuditCode,
    getChampionAuditCodeColor,
} from '../data/championAuditCode';
import {
    ChampionTag,
    championTags,
    getChampionTagColor,
} from '../data/championTags';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import { Champion } from '../types/domain/Champion';
import { getChampionImage } from '../utils/championImageHelpers';
import { mapMmrHistoryCollectionToPlayerMmrHistoryMap } from '../utils/mmrHelpers';
import { getPlayerTopChampions } from '../utils/playerHelpers';

const EMPTY_IMAGE =
    'https://cdn4.iconfinder.com/data/icons/symbols-vol-1-1/40/user-person-single-id-account-player-male-female-512.png';

const TeamBuilderBan = React.memo(function TeamBuilderBan({
    ban,
    setBan,
}: {
    ban: string;
    setBan: (championId: string) => void;
}) {
    const championsResponse = ToxicDataService.useChampions();
    const champions = championsResponse.data ?? {};

    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBan(event.target.value);
    };

    const options = Object.keys(champions)
        .sort((a, b) => a.localeCompare(b))
        .map((name) => {
            return <option value={name}>{name}</option>;
        });

    return (
        <Flex
            direction={'column'}
            flex={1}
            padding={4}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <div style={{ position: 'relative', top: 0, left: 0 }}>
                <img
                    style={{ position: 'relative', top: 0, left: 0 }}
                    src={
                        ban !== undefined
                            ? getChampionImage(championIdMap[ban]).square
                            : EMPTY_IMAGE
                    }
                    height={64}
                    width={64}
                />
                <img
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    src={
                        'https://media.discordapp.net/attachments/1003441926529355826/1036078852818083892/ban_icon.png'
                    }
                    width='100%'
                    height='100%'
                />
            </div>
            <Select placeholder={'Select Ban'} onChange={handleChange}>
                {options}
            </Select>
        </Flex>
    );
});

const TeamBuilderPlayer = React.memo(function TeamBuilderPlayer({
    player,
    champion,
    setPlayer,
    setChampion,
}: {
    player?: string;
    champion?: string;
    setPlayer: (playerName: string) => void;
    setChampion: (chammpionName: string) => void;
}) {
    const championsResponse = ToxicDataService.useChampions();
    const champions = championsResponse.data ?? {};

    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    const playersResponse = ToxicDataService.usePlayers();
    const players = playersResponse.data ?? [];

    const mmrPerMatchResponse = ToxicDataService.useMmrPerMatch();
    const mmrPerMatch = mmrPerMatchResponse.data ?? [];
    const mmrPerMatchMap =
        mapMmrHistoryCollectionToPlayerMmrHistoryMap(mmrPerMatch);

    const championOptions = Object.keys(champions)
        .sort((a, b) => a.localeCompare(b))
        .map((name) => {
            return <option value={name}>{name}</option>;
        });

    const playerOptions = players
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((player) => {
            return <option value={player.name}>{player.name}</option>;
        });

    const handleChampSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setChampion(event.target.value);
    };

    const handlePlayerSelect = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setPlayer(event.target.value);
    };

    const tagsCollection = champion ? championTags[champion] : [];
    const tags = tagsCollection
        ? tagsCollection.map((tag) => {
              return (
                  <Tag
                      textAlign='center'
                      bg={getChampionTagColor(tag)}
                      color={'black'}
                      size={'sm'}
                      minW='100%'
                      marginBottom={1}
                  >
                      <Text>{tag.toString().toUpperCase()}</Text>
                  </Tag>
              );
          })
        : null;

    return (
        <Flex
            alignSelf={'stretch'}
            flexDirection={'row'}
            borderWidth={1}
            borderRadius={8}
            borderColor={'black'}
            marginBottom={4}
        >
            <Flex
                direction={'column'}
                flex={1}
                padding={4}
                justifyContent={'center'}
            >
                <Select
                    placeholder={'Select Champion'}
                    onChange={handleChampSelect}
                >
                    {championOptions}
                </Select>
                <Select
                    placeholder={'Select Player'}
                    onChange={handlePlayerSelect}
                >
                    {playerOptions}
                </Select>
            </Flex>
            <Flex direction={'row'} flex={1} padding={4}>
                <Flex marginRight={4} flex={1}>
                    <img
                        src={
                            champion !== undefined
                                ? getChampionImage(championIdMap[champion])
                                      .square
                                : EMPTY_IMAGE
                        }
                    />
                </Flex>
                <Flex direction={'column'} flex={1} flexWrap={'wrap'}>
                    {tags}
                </Flex>
            </Flex>
        </Flex>
    );
});

type TeamPlayer = {
    playerName?: string;
    championName?: string;
};

type Team = {
    players: { [playerId: number]: TeamPlayer };
    bans: { [banId: number]: string };
};

function auditTeam(team: Team) {
    let audit = [];
    let magic = 0;
    let physical = 0;
    for (const player of Object.values(team.players)) {
        // check for magic damage
        if (player.championName) {
            if (
                championTags[player.championName].findIndex(
                    (value) => value === ChampionTag.Magic
                ) > -1
            ) {
                magic += 1;
            }

            if (
                championTags[player.championName].findIndex(
                    (value) => value === ChampionTag.Physical
                ) > -1
            ) {
                physical += 1;
            }
        }
    }

    if (magic === 0) {
        audit.push(ChampionAuditCode.NoMagicDamage);
    }

    if (physical === 0) {
        audit.push(ChampionAuditCode.NoPhysicalDamage);
    }

    if (physical + magic <= 1) {
        audit.push(ChampionAuditCode.LowDamage);
    }

    return audit;
}

const TeamAuditTags = React.memo(function TeamAuditTags({
    tags,
}: {
    tags: ChampionAuditCode[];
}) {
    const components = tags.map((code) => {
        return (
            <Tag
                textAlign='center'
                bg={getChampionAuditCodeColor(code)}
                color={'black'}
                size={'sm'}
                marginBottom={1}
            >
                <Text>{code.toString().toUpperCase()}</Text>
            </Tag>
        );
    });

    return <>{components}</>;
});

const ChampionIconsRow = React.memo(function ChampionIconsRow({
    champions,
}: {
    champions: Champion[];
}) {
    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    const components = champions
        .map((champion) => {
            return (
                <Tooltip label={champion.name}>
                    <img
                        src={
                            getChampionImage(championIdMap[champion.name])
                                .square
                        }
                        width='32'
                        height='32'
                        style={{ padding: 1 }}
                    />
                </Tooltip>
            );
        })
        .splice(0, 10);

    return <>{components}</>;
});

function useTeamTopChampions(team: TeamPlayer[]) {
    const playersResponse = ToxicDataService.usePlayers();
    const players = playersResponse.data ?? [];

    // look at team 2 and pull their team's top champions
    let team1TopChampions: { [id: string]: Champion } = {};
    for (const teamPlayer of Object.values(team)) {
        const player = players.find(
            (data) => data.name === teamPlayer.playerName
        );
        if (player) {
            const topChampions = getPlayerTopChampions(player);
            for (const champion of topChampions) {
                const topChamp = team1TopChampions[champion.name];
                if (topChamp) {
                    const wins = topChamp.wins + champion.wins;
                    const totalGames =
                        topChamp.totalGames + champion.totalGames;
                    team1TopChampions[champion.name] = {
                        ...topChamp,
                        wins: wins,
                        winPercentage: Math.round((wins / totalGames) * 100),
                    };
                } else {
                    team1TopChampions[champion.name] = champion;
                }
            }
        }
    }

    return Object.values(team1TopChampions).sort(
        (a, b) => b.winPercentage * b.wins - a.winPercentage * a.wins
    );
}

export const TeamBuilder = React.memo(function TeamBuilder() {
    // const navigate = useNavigate();

    // const mmrPerMatchResponse = ToxicDataService.useMmrPerMatch();
    // const mmrPerMatch = mmrPerMatchResponse.data ?? [];
    // const mmrPerMatchMap =
    //     mapMmrHistoryCollectionToPlayerMmrHistoryMap(mmrPerMatch);

    const [team1, setTeam1] = useState<Team>({ players: {}, bans: {} });
    const [team2, setTeam2] = useState<Team>({ players: {}, bans: {} });

    const [team1AuditCodes, setTeam1AuditCodes] = useState<ChampionAuditCode[]>(
        []
    );
    const [team2AuditCodes, setTeam2AuditCodes] = useState<ChampionAuditCode[]>(
        []
    );

    const setTeamBan = (
        banningId: number,
        team: Team,
        setTeam: (team: Team) => void
    ) => {
        return (championId: string) => {
            const newBans = team.bans;
            newBans[banningId] = championId;

            const newTeam: Team = {
                ...team,
                bans: newBans,
            };

            setTeam(newTeam);
        };
    };

    const setTeamPlayer = (
        playerId: number,
        team: Team,
        setTeam: (team: Team) => void
    ) => {
        return (playerName: string) => {
            const newPlayers = team.players;
            newPlayers[playerId] = {
                playerName: playerName,
                championName: team.players[playerId]?.championName,
            };

            const newTeam: Team = {
                ...team,
                players: newPlayers,
            };

            setTeam(newTeam);
        };
    };

    const setTeamChampion = (
        playerId: number,
        team: Team,
        setTeam: (team: Team) => void
    ) => {
        return (championName: string) => {
            const newPlayers = team.players;
            newPlayers[playerId] = {
                playerName: team.players[playerId]?.playerName,
                championName: championName,
            };

            const newTeam: Team = {
                ...team,
                players: newPlayers,
            };

            setTeam(newTeam);
        };
    };

    // team 1 audit
    useEffect(() => {
        setTeam1AuditCodes(auditTeam(team1));
    }, [team1]);

    // team 2 audit
    useEffect(() => {
        setTeam2AuditCodes(auditTeam(team2));
    }, [team2]);

    const team1TopChamps = useTeamTopChampions(Object.values(team1.players));
    const team2TopChamps = useTeamTopChampions(Object.values(team2.players));

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Heading>Team Builder</Heading>
            <h1>v0.0.1</h1>
            <Flex
                direction={'row'}
                alignSelf={'center'}
                maxWidth={1024}
                wrap={'wrap'}
            >
                <Flex
                    flex={1}
                    direction={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    padding={4}
                    borderWidth={1}
                    borderRadius={8}
                    borderColor={'black'}
                    margin={4}
                >
                    <Flex flexDirection='row'>
                        <h1>Team 1</h1>
                    </Flex>
                    <Flex
                        direction={'row'}
                        alignSelf={'stretch'}
                        justifyContent={'center'}
                    >
                        <ChampionIconsRow champions={team1TopChamps} />
                    </Flex>
                    <Flex direction={'row'} alignSelf={'stretch'}>
                        <TeamBuilderBan
                            ban={team1.bans[0]}
                            setBan={setTeamBan(0, team1, setTeam1)}
                        />
                        <TeamBuilderBan
                            ban={team1.bans[1]}
                            setBan={setTeamBan(1, team1, setTeam1)}
                        />
                        <TeamBuilderBan
                            ban={team1.bans[2]}
                            setBan={setTeamBan(2, team1, setTeam1)}
                        />
                        <TeamBuilderBan
                            ban={team1.bans[3]}
                            setBan={setTeamBan(3, team1, setTeam1)}
                        />
                        <TeamBuilderBan
                            ban={team1.bans[4]}
                            setBan={setTeamBan(4, team1, setTeam1)}
                        />
                    </Flex>
                    <TeamBuilderPlayer
                        champion={team1.players[0]?.championName}
                        player={team1.players[0]?.playerName}
                        setChampion={setTeamChampion(0, team1, setTeam1)}
                        setPlayer={setTeamPlayer(0, team1, setTeam1)}
                    />
                    <TeamBuilderPlayer
                        champion={team1.players[1]?.championName}
                        player={team1.players[1]?.playerName}
                        setChampion={setTeamChampion(1, team1, setTeam1)}
                        setPlayer={setTeamPlayer(1, team1, setTeam1)}
                    />
                    <TeamBuilderPlayer
                        champion={team1.players[2]?.championName}
                        player={team1.players[2]?.playerName}
                        setChampion={setTeamChampion(2, team1, setTeam1)}
                        setPlayer={setTeamPlayer(2, team1, setTeam1)}
                    />
                    <TeamBuilderPlayer
                        champion={team1.players[3]?.championName}
                        player={team1.players[3]?.playerName}
                        setChampion={setTeamChampion(3, team1, setTeam1)}
                        setPlayer={setTeamPlayer(3, team1, setTeam1)}
                    />
                    <TeamBuilderPlayer
                        champion={team1.players[4]?.championName}
                        player={team1.players[4]?.playerName}
                        setChampion={setTeamChampion(4, team1, setTeam1)}
                        setPlayer={setTeamPlayer(4, team1, setTeam1)}
                    />
                </Flex>
                <Flex
                    flex={1}
                    direction={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    padding={4}
                    borderWidth={1}
                    borderRadius={8}
                    borderColor={'black'}
                    margin={4}
                >
                    <h1>Team 2</h1>
                    <Flex
                        direction={'row'}
                        alignSelf={'stretch'}
                        justifyContent={'center'}
                    >
                        <ChampionIconsRow champions={team2TopChamps} />
                    </Flex>
                    <Flex direction={'row'} alignSelf={'stretch'}>
                        <TeamBuilderBan
                            ban={team2.bans[0]}
                            setBan={setTeamBan(0, team2, setTeam2)}
                        />
                        <TeamBuilderBan
                            ban={team2.bans[1]}
                            setBan={setTeamBan(1, team2, setTeam2)}
                        />
                        <TeamBuilderBan
                            ban={team2.bans[2]}
                            setBan={setTeamBan(2, team2, setTeam2)}
                        />
                        <TeamBuilderBan
                            ban={team2.bans[3]}
                            setBan={setTeamBan(3, team2, setTeam2)}
                        />
                        <TeamBuilderBan
                            ban={team2.bans[4]}
                            setBan={setTeamBan(4, team2, setTeam2)}
                        />
                    </Flex>
                    <TeamBuilderPlayer
                        champion={team2.players[0]?.championName}
                        player={team2.players[0]?.playerName}
                        setChampion={setTeamChampion(0, team2, setTeam2)}
                        setPlayer={setTeamPlayer(0, team2, setTeam2)}
                    />
                    <TeamBuilderPlayer
                        champion={team2.players[1]?.championName}
                        player={team2.players[1]?.playerName}
                        setChampion={setTeamChampion(1, team2, setTeam2)}
                        setPlayer={setTeamPlayer(1, team2, setTeam2)}
                    />
                    <TeamBuilderPlayer
                        champion={team2.players[2]?.championName}
                        player={team2.players[2]?.playerName}
                        setChampion={setTeamChampion(2, team2, setTeam2)}
                        setPlayer={setTeamPlayer(2, team2, setTeam2)}
                    />
                    <TeamBuilderPlayer
                        champion={team2.players[3]?.championName}
                        player={team2.players[3]?.playerName}
                        setChampion={setTeamChampion(3, team2, setTeam2)}
                        setPlayer={setTeamPlayer(3, team2, setTeam2)}
                    />
                    <TeamBuilderPlayer
                        champion={team2.players[4]?.championName}
                        player={team2.players[4]?.playerName}
                        setChampion={setTeamChampion(4, team2, setTeam2)}
                        setPlayer={setTeamPlayer(4, team2, setTeam2)}
                    />
                </Flex>
            </Flex>
            <Flex
                direction={'row'}
                alignSelf={'center'}
                marginBottom={4}
                alignItems='stretch'
                justifyContent='stretch'
                maxWidth={1024}
                wrap='wrap'
            >
                <Flex
                    flex={1}
                    direction={'column'}
                    alignItems={'flex-end'}
                    justifyContent={'flex-start'}
                    padding={4}
                    borderWidth={1}
                    borderRadius={8}
                    borderColor={'black'}
                    margin={4}
                    minWidth={460}
                >
                    <h1>Team 1 Summary</h1>
                    <TeamAuditTags tags={team1AuditCodes} />
                </Flex>
                <Flex
                    flex={1}
                    direction={'column'}
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                    padding={4}
                    borderWidth={1}
                    borderRadius={8}
                    borderColor={'black'}
                    margin={4}
                    minWidth={460}
                >
                    <h1>Team 2 Summary</h1>
                    <TeamAuditTags tags={team2AuditCodes} />
                </Flex>
            </Flex>
        </div>
    );
});
