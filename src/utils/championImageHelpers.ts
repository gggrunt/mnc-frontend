/**
 * Gets the champion image url given a data dragon champion id.
 * @param championId Data dragon champion id
 */
export function getChampionImage(championId: string) {
    return `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/champion/${championId}.png`
}
