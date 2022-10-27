import { Flex, Heading, Select, Tag, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { championTags, getChampionTagColor } from '../data/championTags';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';
import { getChampionImage } from '../utils/championImageHelpers';
import { mapMmrHistoryCollectionToPlayerMmrHistoryMap } from '../utils/mmrHelpers';

const EMPTY_IMAGE =
    'https://cdn4.iconfinder.com/data/icons/symbols-vol-1-1/40/user-person-single-id-account-player-male-female-512.png';

const TeamBuilderBan = React.memo(function TeamBuilderBan() {
    const championsResponse = ToxicDataService.useChampions();
    const champions = championsResponse.data ?? {};

    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    const [ban, setBan] = useState<string>();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBan(event.target.value);
        console.log(event.target.value);
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
            <img
                src={
                    ban !== undefined
                        ? getChampionImage(championIdMap[ban]).square
                        : EMPTY_IMAGE
                }
                height={64}
                width={64}
            />
            <Select placeholder={'Select Ban'} onChange={handleChange}>
                {options}
            </Select>
        </Flex>
    );
});

const TeamBuilderPlayer = React.memo(function TeamBuilderItem() {
    const [champion, setChampion] = useState<string>();
    const [player, setPlayer] = useState<string>();

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

export const TeamBuilder = React.memo(function TeamBuilder() {
    // const navigate = useNavigate();
    // const usePlaxyersResponse = ToxicDataService.usePlayers();
    // const data = usePlayersResponse.data;

    // const mmrPerMatchResponse = ToxicDataService.useMmrPerMatch();
    // const mmrPerMatch = mmrPerMatchResponse.data ?? [];
    // const mmrPerMatchMap =
    //     mapMmrHistoryCollectionToPlayerMmrHistoryMap(mmrPerMatch);

    const [team1, setTeam1] = useState();
    const [team2, setTeam2] = useState();

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
            <Flex
                direction={'row'}
                alignSelf={'center'}
                maxWidth={1024}
                marginBottom={4}
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
                    marginRight={8}
                >
                    <h1>Team 1</h1>
                    <Flex direction={'row'} alignSelf={'stretch'}>
                        <TeamBuilderBan />
                        <TeamBuilderBan />
                        <TeamBuilderBan />
                        <TeamBuilderBan />
                        <TeamBuilderBan />
                    </Flex>
                    <TeamBuilderPlayer />
                    <TeamBuilderPlayer />
                    <TeamBuilderPlayer />
                    <TeamBuilderPlayer />
                    <TeamBuilderPlayer />
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
                >
                    <h1>Team 2</h1>
                    <Flex direction={'row'} alignSelf={'stretch'}>
                        <TeamBuilderBan />
                        <TeamBuilderBan />
                        <TeamBuilderBan />
                        <TeamBuilderBan />
                        <TeamBuilderBan />
                    </Flex>
                    <TeamBuilderPlayer />
                    <TeamBuilderPlayer />
                    <TeamBuilderPlayer />
                    <TeamBuilderPlayer />
                    <TeamBuilderPlayer />
                </Flex>
            </Flex>
            <Flex direction={'row'} alignSelf={'center'} maxWidth={1024}>
                <Flex
                    flex={1}
                    direction={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    padding={4}
                    borderWidth={1}
                    borderRadius={8}
                    borderColor={'black'}
                    marginRight={8}
                >
                    <h1>Team 1 Summary</h1>
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
                >
                    <h1>Team 2 Summary</h1>
                </Flex>
            </Flex>
        </div>
    );
});
