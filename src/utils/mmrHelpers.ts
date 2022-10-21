import { MmrHistoryItem } from '../types/domain/MmrHistoryItem';
import { Player } from '../types/domain/Player';

export function getMmrValue(player: Player): number {
    return player.mmr && (player.wins ?? 0) + (player.losses ?? 0) >= 10
        ? Math.round(player.mmr)
        : 0;
}

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
 * Takes a collection of a player's mmr history items, and returns the average mmr change
 * from the most recent games, up to five games worth of mmr changes
 */
export function getMmrTrendingChange(data: { gameId: number; mmr: number }[]) {
    // this will return an array of the last 5 items (or if less than 5 items, the entire collection)
    const recentMatches = data.slice(-6);
    const gameCount = recentMatches.length;
    if (gameCount <= 1) {
        return 0;
    }
    console.log(recentMatches);
    const totalChange = recentMatches[gameCount - 1].mmr - recentMatches[0].mmr;
    const trend = totalChange / (gameCount - 1);
    // return rounded to nearest decimal
    return parseFloat(trend.toFixed(1));
}
