import { Champion } from '../types/domain/Champion';
import { Player } from '../types/domain/Player';

export function getPlayerTopChampions(player: Player) {
    let topChampions: Champion[] = [];

    const champions = player.champions;

    if (champions !== undefined) {
        topChampions = Object.values(champions).sort((a, b) => {
            return b.wins * b.winPercentage - a.wins * a.winPercentage;
        });
    }

    return topChampions;
}
