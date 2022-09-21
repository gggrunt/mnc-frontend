import { Champion } from "../../types/domain/Champion";
import { Player } from "../../types/domain/Player";
import { StatsData } from "../../types/service/toxicData/StatsData";

export function mapStats(data: StatsData): {players: Player[], champions: {[id: string]: Champion}} {
    const championMap: { [key: string]: Champion } = {};
    const players: Player[] = Object.entries(data).map(
        (kvPair)=> {
            let wins = 0; 
            let losses = 0;
            let champions: {[key: string]: Champion} = {};
            // loop through all of the champions this player has and collect the wins and loses
            for (const [championName, champion] of Object.entries(kvPair[1].champion)) {
                wins += champion.win;
                losses += champion.loss;

                champions[championName] = {
                    name: championName,
                    losses: champion.loss,
                    wins: champion.win,
                    totalGames: champion.loss + champion.win,
                    winPercentage: Math.round(champion.win_rate * 100)
                }

                // also update our champion map
                if (championMap[championName] === undefined) {
                    const totalGames = champion.loss + champion.win;
                    // champion does not exist in our map, so we can add it
                    championMap[championName] = {
                      name: championName,
                      losses: champion.loss,
                      wins: champion.win,
                      totalGames: totalGames,
                      winPercentage: Math.round(champion.win / totalGames * 100),
                    };
                  } else {
                    const wins = championMap[championName].wins + champion.win;
                    const losses = championMap[championName].losses + champion.loss;
                    championMap[championName] = {
                      name: championName,
                      losses,
                      wins,
                      winPercentage: Math.round((wins / (wins + losses)) * 100),
                      totalGames:
                        championMap[championName].totalGames + champion.loss + champion.win,
                    };
                  }
            }

            return {
                name: kvPair[0],
                wins,
                losses,
                champions,
            }
        }
    )

    return {players, champions: championMap};
}
