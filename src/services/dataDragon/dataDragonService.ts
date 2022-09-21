import axios from 'axios'
import { Champions } from '../../types/service/dataDragon/DataDragonChampions'

const championDataEndpoint =
    'http://ddragon.leagueoflegends.com/cdn/12.17.1/data/en_US/champion.json'

export const fetchChampions = () =>
    axios
        .get<Champions>(championDataEndpoint, {
            headers: {
                Accept: 'application/json',
            },
        })
        .then((res) => res.data)
