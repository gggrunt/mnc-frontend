import { MmrHistoryItem } from '../types/domain/MmrHistoryItem';

export function getMmrColor(mmr: number) {
    return mmr > 0
        ? `hsl(${120 * ((1800 - mmr) / 1800) * 4 * -1 + 120}, 100%, 67%)`
        : 'transparent';
}

/**
 * Takes in a collection of match history items and returns a map of
 * player name to an collection of their games (with the game id and the player's resulting mmr for that game)
 */
export function mapMmrHistoryCollectionToPlayerMmrHistoryMap(
    data: MmrHistoryItem[]
): { [key: string]: { gameId: number; mmr: number }[] } {
    const playerMMR: { [key: string]: { gameId: number; mmr: number }[] } = {};

    for (let i = 0; i < data.length; i++) {
        const match = data[i];
        for (const playerName of Object.keys(match.players)) {
            if (playerMMR[playerName] === undefined) {
                playerMMR[playerName] = [];
            }

            if (playerMMR[playerName].length > 0) {
                let mostRecent =
                    playerMMR[playerName][playerMMR[playerName].length - 1];
                if (mostRecent.mmr === match.players[playerName]) continue;
            }

            playerMMR[playerName].push({
                gameId: i + 1,
                mmr: match.players[playerName],
            });
        }
    }
    return playerMMR;
}

/**
 * Takes a collection of a player's mmr history items, and returns the trending percentage change
 * based on the last 5 games completed
 */
export function getMmrTrendingPercentage(
    data: { gameId: number; mmr: number }[]
) {
    // this will return an array of the last 5 items (or if less than 5 items, the entire collection)
    const last5Matches = data.slice(-5);

    // of the latest games, returns the percent change between the most recent game and the latest game
    return last5Matches.length > 0
        ? Math.round(
              ((last5Matches[last5Matches.length - 1].mmr -
                  last5Matches[0].mmr) /
                  last5Matches[0].mmr) *
                  10000
          ) / 100
        : 0;
}
