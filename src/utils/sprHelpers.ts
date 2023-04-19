import { Player } from '../types/domain/Player';

const MIN_GAMES_REQUIRED = 30;
const MAXIMUM_VALUE = 1800;

export function getSprValue(player: Player): number {
    return player.glicko ? Math.round(player.glicko) : 0;
}

export function getSprColor(spr: number) {
    return spr > 0
        ? `hsl(${
              120 * ((MAXIMUM_VALUE - spr) / MAXIMUM_VALUE) * 4 * -1 + 120
          }, 100%, 67%)`
        : 'transparent';
}

export function isPlayerRanked(player: Player): boolean {
    return (player.wins ?? 0) + (player.losses ?? 0) >= MIN_GAMES_REQUIRED;
}

export function orderPlayersByRank(players: Player[]) {
    players.sort((p1, p2) => comparePlayersByRank(p1, p2));
}

function comparePlayersByRank(p1: Player, p2: Player): number {
    const p1IsRanked = isPlayerRanked(p1);
    const p2IsRanked = isPlayerRanked(p2);
    if (p1IsRanked && !p2IsRanked) {
        return 1;
    } else if (p2IsRanked && !p1IsRanked) {
        return -1;
    } else {
        return getSprValue(p1) - getSprValue(p2);
    }
}
