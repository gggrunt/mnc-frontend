import { StatsData } from '../../types/service/toxicData/StatsData'
import { mapStats } from './dataMapper'

describe('mapStats', () => {
    const mockToxicStatsData: StatsData = {
        player1: {
            champion: {
                Leona: {
                    games: 10,
                    loss: 5,
                    win: 5,
                    win_rate: 0.5,
                },
                'Dr. Mundo': {
                    games: 5,
                    loss: 1,
                    win: 4,
                    win_rate: 0.8,
                },
            },
            opponent: {
                player2: {
                    games: 4,
                    loss: 1,
                    win: 3,
                    win_rate: 0.75,
                },
            },
            teammate: {
                player3: {
                    games: 2,
                    loss: 2,
                    win: 0,
                    win_rate: 0,
                },
            },
        },
        player2: {
            champion: {
                Leona: {
                    games: 10,
                    loss: 4,
                    win: 6,
                    win_rate: 0.6,
                },
                Morgana: {
                    games: 10,
                    loss: 8,
                    win: 2,
                    win_rate: 0.2,
                },
            },
            teammate: {
                player3: {
                    games: 10,
                    loss: 5,
                    win: 5,
                    win_rate: 0.5,
                },
                player1: {
                    games: 5,
                    loss: 1,
                    win: 4,
                    win_rate: 0.8,
                },
            },
            opponent: {},
        },
    }

    it('should map a toxic stats response into a map of champion names to domain champions AND a collection of players', () => {
        const result = mapStats(mockToxicStatsData)
        expect(result.champions).toEqual({
            Leona: {
                totalGames: 20,
                wins: 11,
                losses: 9,
                winPercentage: 55,
                name: 'Leona',
            },
            Morgana: {
                totalGames: 10,
                losses: 8,
                wins: 2,
                winPercentage: 20,
                name: 'Morgana',
            },
            'Dr. Mundo': {
                totalGames: 5,
                losses: 1,
                wins: 4,
                winPercentage: 80,
                name: 'Dr. Mundo',
            },
        })
        expect(result.players).toEqual([
            {
                name: 'player1',
                wins: 9,
                losses: 6,
                champions: {
                    Leona: {
                        name: 'Leona',
                        totalGames: 10,
                        losses: 5,
                        wins: 5,
                        winPercentage: 50,
                    },
                    'Dr. Mundo': {
                        name: 'Dr. Mundo',
                        totalGames: 5,
                        losses: 1,
                        wins: 4,
                        winPercentage: 80,
                    },
                },
            },
            {
                name: 'player2',
                losses: 12,
                wins: 8,
                champions: {
                    Leona: {
                        name: 'Leona',
                        totalGames: 10,
                        losses: 4,
                        wins: 6,
                        winPercentage: 60,
                    },
                    Morgana: {
                        name: 'Morgana',
                        totalGames: 10,
                        losses: 8,
                        wins: 2,
                        winPercentage: 20,
                    },
                },
            },
        ])
    })
})
