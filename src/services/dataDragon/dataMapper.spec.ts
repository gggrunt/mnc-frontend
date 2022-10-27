import { Champions } from '../../types/service/dataDragon/DataDragonChampions';
import { mapChampions } from './dataMapper';

describe('mapChampions', () => {
    const mockDataDragonChampions: Champions = {
        data: {
            ddchamp1: {
                id: 'ddchamp1',
                name: 'Ahri',
                image: {
                    full: 'ahri full img',
                    sprite: 'ahri sprite img',
                },
            },
            ddchamp2: {
                id: 'ddchamp2',
                name: 'Dr. Mundo',
                image: {
                    full: 'dr mundo full img',
                    sprite: 'dr mundo sprite img',
                },
            },
        },
    };

    it('should map a collection of data dragon champions into a map of champion name to data dragon champion id', () => {
        const result = mapChampions(mockDataDragonChampions);
        expect(result).toEqual({ Ahri: 'ddchamp1', 'Dr. Mundo': 'ddchamp2' });
    });
});
