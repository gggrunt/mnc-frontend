import React, { useEffect, useState } from 'react';
import { getSprColor, MIN_GAMES_REQUIRED } from '../utils/sprHelpers';

import CSS from 'csstype';
import { PlayerCard } from './slideshow/PlayerCard';
import { getChampionImage } from '../utils/championImageHelpers';
import { DataDragonService } from '../services/dataDragon/DataDragonService';
import { ToxicDataService } from '../services/toxicData/ToxicDataService';

const styles = {
    header: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 64,
        color: 'white',
        marginBottom: 32,
        textAlign: 'center',
    } as any,
    content: {
        padding: '32px',
        height: '720px',
        maxWidth: '1024px',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    } as any,
    footer: {
        fontSize: 24,
        color: 'white',
        marginTop: 32,
        textAlign: 'center',
    } as any,
};

const containerBase: CSS.Properties = {
    position: 'absolute',
    top: '64px',
    bottom: '0px',
    left: '0px',
    right: '0px',
    transition:
        '0.5s' /* 0.5 second transition effect to slide in the sidenav */,
};

const visibleContainer: CSS.Properties = {
    ...containerBase,
    opacity: 1.0,
};

const hiddenContainer: CSS.Properties = {
    ...containerBase,
    opacity: 0,
};

enum StatsRowValueType {
    mmr,
    percentage,
    number,
}

const StatsRow = (props: {
    name?: string;
    value?: number;
    showAsterick?: boolean;
    valueType?: StatsRowValueType;
    imageUri?: string;
}) => {
    return (
        <div
            style={{
                flex: 1,
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'stretch',
                paddingLeft: 128,
                paddingRight: 128,
            }}
        >
            {props.imageUri ? (
                <img src={props.imageUri} style={{ width: 64, height: 64 }} />
            ) : null}
            <h1
                style={{
                    fontSize: 48,
                    fontWeight: 'bold',
                    color: 'white',
                }}
            >
                {props.name ? props.name.toUpperCase() : ''}
            </h1>
            <h1
                style={{
                    fontSize: 60,
                    fontWeight: 'bold',
                    color:
                        props.valueType === StatsRowValueType.mmr &&
                        !props.showAsterick
                            ? getSprColor(props.value ?? 0)
                            : 'white',
                    textShadow:
                        props.valueType === StatsRowValueType.mmr
                            ? '2px 2px 7px black'
                            : undefined,
                }}
            >
                {Math.round(props.value ?? 0)} {props.showAsterick ? '*' : ''}
                {props.valueType === StatsRowValueType.percentage ? '%' : ''}
            </h1>
        </div>
    );
};

const mmrScreenCount = 4;
const championScreenCount = 4;

export const Slideshow = React.memo(function Slideshow({
    transparentBackground,
}: {
    transparentBackground?: boolean;
}) {
    // TODO: read the hydra data based on a url query parameter
    const SEASON_NUMBER = 1;
    const playersResponse = ToxicDataService.usePlayers(SEASON_NUMBER);
    const players = playersResponse.data ?? [];

    // do not limit champion win rate data to a single season (there simply aren't enough games)
    const championsResponse = ToxicDataService.useChampions();
    const champions = Array.from(Object.values(championsResponse.data ?? {}));

    const [slideNo, setSlideNo] = useState(0);
    const championIdMapResponse = DataDragonService.useChampionIdMap();
    const championIdMap = championIdMapResponse.data ?? {};

    // sort the players by SPR
    const sortedPlayers = players
        ? players
              // ignore the placements filter
              //.filter((value) => (value.wins ?? 0) + (value.losses ?? 0) >= 10)
              .sort((a, b) => {
                  // put all qualified players at the beginning of the leaderboard
                  const aValue =
                      (a.wins ?? 0) + (a.losses ?? 0) >= MIN_GAMES_REQUIRED
                          ? (a.glicko ?? 0) * 1000
                          : a.glicko ?? 0;
                  const bValue =
                      (b.wins ?? 0) + (b.losses ?? 0) >= MIN_GAMES_REQUIRED
                          ? (b.glicko ?? 0) * 1000
                          : b.glicko ?? 0;
                  return bValue - aValue;
              })
        : [];

    // sort the champions by win rate
    const sortedChampions = champions
        ? champions
              .filter((value) => value.totalGames >= 10)
              .sort((a, b) => b.winPercentage - a.winPercentage)
        : [];

    // take the top 16 players and convert them to player cards
    const playerSlides = sortedPlayers.slice(0, 16).map((value, index) => {
        return (
            <div
                key={index}
                style={
                    slideNo === mmrScreenCount + index
                        ? visibleContainer
                        : hiddenContainer
                }
            >
                <PlayerCard player={value} />
            </div>
        );
    });

    useEffect(() => {
        document.title = 'Hydra';
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (
                slideNo <
                mmrScreenCount - 1 + playerSlides.length + championScreenCount
            ) {
                setSlideNo(slideNo + 1);
            } else {
                setSlideNo(0);
            }
        }, 7000);
    }, [slideNo, playerSlides]);

    if (sortedPlayers.length === 0) {
        return null;
    }

    const LATEST_RANKED_STANDINGS_HEADER = 'LATEST RANKED STANDINGS';
    const ASTERICK_EXPLANATION = '* unqualified SPR';

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                backgroundColor: transparentBackground ? undefined : 'magenta',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 64,
            }}
        >
            <div style={slideNo === 0 ? visibleContainer : hiddenContainer}>
                <div style={styles.content}>
                    <h1 style={styles.header}>
                        {LATEST_RANKED_STANDINGS_HEADER}
                    </h1>
                    <StatsRow
                        name={sortedPlayers[0].name}
                        value={sortedPlayers[0].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[0].wins ?? 0) +
                                (sortedPlayers[0].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[1].name}
                        value={sortedPlayers[1].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[1].wins ?? 0) +
                                (sortedPlayers[1].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[2].name}
                        value={sortedPlayers[2].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[2].wins ?? 0) +
                                (sortedPlayers[2].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[3].name}
                        value={sortedPlayers[3].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[3].wins ?? 0) +
                                (sortedPlayers[3].losses ?? 0) <
                            30
                        }
                    />
                    <p style={styles.footer}>{ASTERICK_EXPLANATION}</p>
                </div>
            </div>
            <div style={slideNo === 1 ? visibleContainer : hiddenContainer}>
                <div style={styles.content}>
                    <h1 style={styles.header}>
                        {LATEST_RANKED_STANDINGS_HEADER}
                    </h1>
                    <StatsRow
                        name={sortedPlayers[4].name}
                        value={sortedPlayers[4].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[4].wins ?? 0) +
                                (sortedPlayers[4].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[5].name}
                        value={sortedPlayers[5].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[5].wins ?? 0) +
                                (sortedPlayers[5].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[6].name}
                        value={sortedPlayers[6].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[6].wins ?? 0) +
                                (sortedPlayers[6].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[7].name}
                        value={sortedPlayers[7].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[7].wins ?? 0) +
                                (sortedPlayers[7].losses ?? 0) <
                            30
                        }
                    />
                    <p style={styles.footer}>{ASTERICK_EXPLANATION}</p>
                </div>
            </div>
            <div style={slideNo === 2 ? visibleContainer : hiddenContainer}>
                <div style={styles.content}>
                    <h1 style={styles.header}>
                        {LATEST_RANKED_STANDINGS_HEADER}
                    </h1>
                    <StatsRow
                        name={sortedPlayers[8].name}
                        value={sortedPlayers[8].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[8].wins ?? 0) +
                                (sortedPlayers[8].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[9].name}
                        value={sortedPlayers[9].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[9].wins ?? 0) +
                                (sortedPlayers[9].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[10].name}
                        value={sortedPlayers[10].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[10].wins ?? 0) +
                                (sortedPlayers[10].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[11].name}
                        value={sortedPlayers[11].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[11].wins ?? 0) +
                                (sortedPlayers[11].losses ?? 0) <
                            30
                        }
                    />
                    <p style={styles.footer}>{ASTERICK_EXPLANATION}</p>
                </div>
            </div>
            <div style={slideNo === 3 ? visibleContainer : hiddenContainer}>
                <div style={styles.content}>
                    <h1 style={styles.header}>
                        {LATEST_RANKED_STANDINGS_HEADER}
                    </h1>
                    <StatsRow
                        name={sortedPlayers[12].name}
                        value={sortedPlayers[12].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[12].wins ?? 0) +
                                (sortedPlayers[12].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[13].name}
                        value={sortedPlayers[13].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[13].wins ?? 0) +
                                (sortedPlayers[13].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[14].name}
                        value={sortedPlayers[14].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[14].wins ?? 0) +
                                (sortedPlayers[14].losses ?? 0) <
                            30
                        }
                    />
                    <StatsRow
                        name={sortedPlayers[15].name}
                        value={sortedPlayers[15].glicko}
                        valueType={StatsRowValueType.mmr}
                        showAsterick={
                            (sortedPlayers[15].wins ?? 0) +
                                (sortedPlayers[15].losses ?? 0) <
                            30
                        }
                    />
                    <p style={styles.footer}>{ASTERICK_EXPLANATION}</p>
                </div>
            </div>
            {playerSlides}
            <div
                style={
                    slideNo === mmrScreenCount + playerSlides.length
                        ? visibleContainer
                        : hiddenContainer
                }
            >
                <div style={styles.content}>
                    <h1 style={styles.header}>{'CHAMPION WIN RATES'}</h1>
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[0].name]
                            ).square
                        }
                        name={sortedChampions[0].name}
                        value={sortedChampions[0].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[1].name]
                            ).square
                        }
                        name={sortedChampions[1].name}
                        value={sortedChampions[1].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[2].name]
                            ).square
                        }
                        name={sortedChampions[2].name}
                        value={sortedChampions[2].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[3].name]
                            ).square
                        }
                        name={sortedChampions[3].name}
                        value={sortedChampions[3].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                </div>
            </div>
            <div
                style={
                    slideNo === mmrScreenCount + playerSlides.length + 1
                        ? visibleContainer
                        : hiddenContainer
                }
            >
                <div style={styles.content}>
                    <h1 style={styles.header}>{'CHAMPION WIN RATES'}</h1>
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[4].name]
                            ).square
                        }
                        name={sortedChampions[4].name}
                        value={sortedChampions[4].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[5].name]
                            ).square
                        }
                        name={sortedChampions[5].name}
                        value={sortedChampions[5].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[6].name]
                            ).square
                        }
                        name={sortedChampions[6].name}
                        value={sortedChampions[6].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[7].name]
                            ).square
                        }
                        name={sortedChampions[7].name}
                        value={sortedChampions[7].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                </div>
            </div>
            <div
                style={
                    slideNo === mmrScreenCount + playerSlides.length + 2
                        ? visibleContainer
                        : hiddenContainer
                }
            >
                <div style={styles.content}>
                    <h1 style={styles.header}>{'CHAMPION WIN RATES'}</h1>
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[8].name]
                            ).square
                        }
                        name={sortedChampions[8].name}
                        value={sortedChampions[8].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[9].name]
                            ).square
                        }
                        name={sortedChampions[9].name}
                        value={sortedChampions[9].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[10].name]
                            ).square
                        }
                        name={sortedChampions[10].name}
                        value={sortedChampions[10].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[11].name]
                            ).square
                        }
                        name={sortedChampions[11].name}
                        value={sortedChampions[11].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                </div>
            </div>
            <div
                style={
                    slideNo === mmrScreenCount + playerSlides.length + 3
                        ? visibleContainer
                        : hiddenContainer
                }
            >
                <div style={styles.content}>
                    <h1 style={styles.header}>{'CHAMPION WIN RATES'}</h1>
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[12].name]
                            ).square
                        }
                        name={sortedChampions[12].name}
                        value={sortedChampions[12].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[13].name]
                            ).square
                        }
                        name={sortedChampions[13].name}
                        value={sortedChampions[13].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[14].name]
                            ).square
                        }
                        name={sortedChampions[14].name}
                        value={sortedChampions[14].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                    <StatsRow
                        imageUri={
                            getChampionImage(
                                championIdMap[sortedChampions[15].name]
                            ).square
                        }
                        name={sortedChampions[15].name}
                        value={sortedChampions[15].winPercentage}
                        valueType={StatsRowValueType.percentage}
                    />
                </div>
            </div>
        </div>
    );
});
