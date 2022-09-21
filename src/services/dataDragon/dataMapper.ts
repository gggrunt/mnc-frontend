import { Champions } from '../../types/service/dataDragon/DataDragonChampions'

export function mapChampions(data: Champions) {
    const championMap: { [key: string]: string } = {}
    // get a mapping of friendly name to data dragon champion id
    // mnc-frontend uses friendly name as the key for its champions map
    for (const championId of Object.keys(data.data)) {
        championMap[data.data[championId].name] = data.data[championId].id
    }
    return championMap
}
