import { Champion } from '../types/domain/Champion';

export enum ChampionClass {
    Diver = 'Diver',
    Juggernaut = 'Juggernaut',
    Catcher = 'Catcher',
    Enchanter = 'Enchanter',
    Artillery = 'Artillery',
    Battlemage = 'Battlemage',
    Burst = 'Burst',
    Marksman = 'Marksman',
    Assassin = 'Assassin',
    Skirmishers = 'Skirmishers',
    Specialist = 'Specialiist',
    Vanguard = 'Vanguard',
    Warden = 'Warden',
}

/**
 * Given a collection of champions, will return a map of champion classes and the respective
 * win rates for those classes. The champion classes will be ordered in the same order as the enum
 */
export function championClassWinRates(champions: Champion[]) {
    const classWinRate: { [id: string]: { wins: number; losses: number } } = {};

    // initialize all win rates to 0
    for (const championClass of Object.keys(ChampionClass)) {
        classWinRate[championClass] = { wins: 0, losses: 0 };
    }

    for (const champion of champions) {
        const championClasses = ChampionClassMap[champion.name];
        if (championClasses) {
            // champions may have multiple classes, so iterate through all of them
            for (const championClass of championClasses) {
                const existingClassWinRate = classWinRate[championClass];
                if (existingClassWinRate === undefined) {
                    classWinRate[championClass] = {
                        losses: champion.losses,
                        wins: champion.wins,
                    };
                } else {
                    // this champion class already exists so we just update the wins and loses
                    classWinRate[championClass] = {
                        losses: existingClassWinRate.losses + champion.losses,
                        wins: existingClassWinRate.wins + champion.wins,
                    };
                }
            }
        } else {
            // this means that there are champions that we do not know about
            console.log('ERROR: unknown champion: ' + champion.name);
        }
    }

    return classWinRate;
}

// from the league of legends fandom wiki
export const ChampionClassMap: { [id: string]: ChampionClass[] } = {
    Camille: [ChampionClass.Diver],
    Elise: [ChampionClass.Diver],
    Hecarim: [ChampionClass.Diver],
    Irelia: [ChampionClass.Diver],
    'Jarvan IV': [ChampionClass.Diver],
    'Lee Sin': [ChampionClass.Diver],
    Olaf: [ChampionClass.Diver],
    Pantheon: [ChampionClass.Diver],
    "Rek'Sai": [ChampionClass.Diver],
    Renekton: [ChampionClass.Diver],
    Skarner: [ChampionClass.Diver],
    Vi: [ChampionClass.Diver],
    Warwick: [ChampionClass.Diver],
    Wukong: [ChampionClass.Diver],
    'Xin Zhao': [ChampionClass.Diver],
    Aatrox: [ChampionClass.Juggernaut],
    Darius: [ChampionClass.Juggernaut],
    'Dr. Mundo': [ChampionClass.Juggernaut],
    Garen: [ChampionClass.Juggernaut],
    Illaoi: [ChampionClass.Juggernaut],
    Mordekaiser: [ChampionClass.Juggernaut],
    Nasus: [ChampionClass.Juggernaut],
    Sett: [ChampionClass.Juggernaut],
    Shyvana: [ChampionClass.Juggernaut],
    Trundle: [ChampionClass.Juggernaut],
    Udyr: [ChampionClass.Juggernaut],
    Urgot: [ChampionClass.Juggernaut],
    Volibear: [ChampionClass.Juggernaut],
    Yorick: [ChampionClass.Juggernaut],
    Bard: [ChampionClass.Catcher],
    Blitzcrank: [ChampionClass.Catcher],
    Ivern: [ChampionClass.Catcher],
    Morgana: [ChampionClass.Catcher],
    Neeko: [ChampionClass.Catcher, ChampionClass.Burst],
    Pyke: [ChampionClass.Catcher, ChampionClass.Assassin],
    Rakan: [ChampionClass.Catcher],
    Thresh: [ChampionClass.Catcher],
    Zyra: [ChampionClass.Catcher],
    Janna: [ChampionClass.Enchanter],
    Karma: [ChampionClass.Enchanter, ChampionClass.Burst],
    Lulu: [ChampionClass.Enchanter],
    Nami: [ChampionClass.Enchanter],
    'Renata Glasc': [ChampionClass.Enchanter],
    Seraphine: [ChampionClass.Enchanter, ChampionClass.Burst],
    Sona: [ChampionClass.Enchanter],
    Soraka: [ChampionClass.Enchanter],
    Taric: [ChampionClass.Enchanter, ChampionClass.Warden],
    Yuumi: [ChampionClass.Enchanter],
    Jayce: [ChampionClass.Artillery],
    Lux: [ChampionClass.Artillery, ChampionClass.Burst],
    "Vel'Koz": [ChampionClass.Artillery],
    Xerath: [ChampionClass.Artillery],
    Ziggs: [ChampionClass.Artillery],
    Anivia: [ChampionClass.Battlemage],
    'Aurelion Sol': [ChampionClass.Battlemage],
    Cassiopeia: [ChampionClass.Battlemage],
    Karthus: [ChampionClass.Battlemage],
    Malzahar: [ChampionClass.Battlemage],
    Rumble: [ChampionClass.Battlemage],
    Ryze: [ChampionClass.Battlemage],
    Swain: [ChampionClass.Battlemage],
    Taliyah: [ChampionClass.Battlemage],
    Viktor: [ChampionClass.Battlemage],
    Vladimir: [ChampionClass.Battlemage],
    Ahri: [ChampionClass.Burst],
    Annie: [ChampionClass.Burst],
    Brand: [ChampionClass.Burst],
    LeBlanc: [ChampionClass.Burst],
    Lissandra: [ChampionClass.Burst],
    Orianna: [ChampionClass.Burst],
    Syndra: [ChampionClass.Burst],
    'Twisted Fate': [ChampionClass.Burst],
    Veigar: [ChampionClass.Burst],
    Vex: [ChampionClass.Burst],
    Zoe: [ChampionClass.Burst],
    Aphelios: [ChampionClass.Marksman],
    Ashe: [ChampionClass.Marksman],
    Caitlyn: [ChampionClass.Marksman],
    Corki: [ChampionClass.Marksman],
    Draven: [ChampionClass.Marksman],
    Ezreal: [ChampionClass.Marksman],
    Jhin: [ChampionClass.Marksman, ChampionClass.Catcher],
    Jinx: [ChampionClass.Marksman],
    "Kai'Sa": [ChampionClass.Marksman],
    Kalista: [ChampionClass.Marksman],
    Kindred: [ChampionClass.Marksman],
    "Kog'Maw": [ChampionClass.Marksman],
    Lucian: [ChampionClass.Marksman],
    'Miss Fortune': [ChampionClass.Marksman],
    Samira: [ChampionClass.Marksman],
    Senna: [ChampionClass.Marksman, ChampionClass.Enchanter],
    Sivir: [ChampionClass.Marksman],
    Tristana: [ChampionClass.Marksman],
    Twitch: [ChampionClass.Marksman],
    Varus: [ChampionClass.Marksman, ChampionClass.Artillery],
    Vayne: [ChampionClass.Marksman],
    Xayah: [ChampionClass.Marksman],
    Zeri: [ChampionClass.Marksman],
    Akali: [ChampionClass.Assassin],
    Akshan: [ChampionClass.Assassin, ChampionClass.Marksman],
    Diana: [ChampionClass.Assassin, ChampionClass.Diver],
    Ekko: [ChampionClass.Assassin],
    Evelynn: [ChampionClass.Assassin],
    Fizz: [ChampionClass.Assassin],
    Kassadin: [ChampionClass.Assassin],
    Katarina: [ChampionClass.Assassin],
    "Kha'Zix": [ChampionClass.Assassin],
    Nocturne: [ChampionClass.Assassin],
    Qiyana: [ChampionClass.Assassin],
    Rengar: [ChampionClass.Assassin, ChampionClass.Diver],
    Shaco: [ChampionClass.Assassin],
    Talon: [ChampionClass.Assassin],
    Zed: [ChampionClass.Assassin],
    "Bel'Veth": [ChampionClass.Skirmishers],
    Fiora: [ChampionClass.Skirmishers],
    Gwen: [ChampionClass.Skirmishers],
    Jax: [ChampionClass.Skirmishers],
    Kayn: [ChampionClass.Skirmishers],
    Kled: [ChampionClass.Skirmishers],
    Lillia: [ChampionClass.Skirmishers],
    'Master Yi': [ChampionClass.Skirmishers],
    Nilah: [ChampionClass.Skirmishers],
    Riven: [ChampionClass.Skirmishers],
    Sylas: [ChampionClass.Skirmishers, ChampionClass.Burst],
    Tryndamere: [ChampionClass.Skirmishers],
    Viego: [ChampionClass.Skirmishers],
    Yasuo: [ChampionClass.Skirmishers],
    Yone: [ChampionClass.Skirmishers, ChampionClass.Assassin],
    Azir: [ChampionClass.Specialist],
    "Cho'Gath": [ChampionClass.Specialist],
    Fiddlesticks: [ChampionClass.Specialist],
    Gangplank: [ChampionClass.Specialist],
    Gnar: [ChampionClass.Specialist],
    Graves: [ChampionClass.Specialist],
    Heimerdinger: [ChampionClass.Specialist],
    Kayle: [ChampionClass.Specialist],
    Kennen: [ChampionClass.Specialist],
    Nidalee: [ChampionClass.Specialist],
    Quinn: [ChampionClass.Specialist],
    Singed: [ChampionClass.Specialist],
    Teemo: [ChampionClass.Specialist],
    Zilean: [ChampionClass.Specialist],
    Alistar: [ChampionClass.Vanguard],
    Amumu: [ChampionClass.Vanguard],
    Gragas: [ChampionClass.Vanguard],
    Leona: [ChampionClass.Vanguard],
    Malphite: [ChampionClass.Vanguard],
    Maokai: [ChampionClass.Vanguard],
    Nautilus: [ChampionClass.Vanguard],
    'Nunu & Willump': [ChampionClass.Vanguard],
    Ornn: [ChampionClass.Vanguard],
    Rammus: [ChampionClass.Vanguard],
    Rell: [ChampionClass.Vanguard],
    Sejuani: [ChampionClass.Vanguard],
    Sion: [ChampionClass.Vanguard],
    Zac: [ChampionClass.Vanguard],
    Braum: [ChampionClass.Warden],
    Galio: [ChampionClass.Warden],
    Poppy: [ChampionClass.Warden],
    Shen: [ChampionClass.Warden],
    'Tahm Kench': [ChampionClass.Warden],
    "K'Sante": [ChampionClass.Warden, ChampionClass.Skirmishers],
};
