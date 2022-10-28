export type Season = {
    name: string;
    active: boolean;
};

export const Seasons: { [key: string]: Season } = {
    ALL_SEASONS: { name: 'All Seasons', active: false },
    // SEASON_ONE: { name: 'Season 1', active: true },
};

export const getSeasons = (): Array<Season> => {
    return Object.values(Seasons);
};

export const getActiveSeason = (): Season => {
    const activeSeason = Object.values(Seasons).find((season) => season.active);
    return activeSeason ? activeSeason : Seasons.ALL_SEASONS;
};
