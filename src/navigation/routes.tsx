import { createBrowserRouter } from 'react-router-dom';

import { PlayerOverview } from '../playerOverview/PlayerOverview';
import Home from '../home/Home';
import { Matchmaker } from '../matchmaker/Matchmaker';
import Root from './Root';
import {
    loader as playerLoader,
    PlayerScreen,
} from '../playerOverview/PlayerScreen';
import { ChampionOverview } from '../championOverview/ChampionOverview';
import {
    loader as championLoader,
    ChampionScreen,
} from '../championOverview/ChampionScreen';
import { Error } from '../components/Error';
import { loader as casterLoader, CasterScreen } from '../admin/CasterScreen';
import { Slideshow } from '../admin/Slideshow';
import { MatchHistory } from '../matchHistory/MatchHistory';
import {
    loader as matchLoader,
    MatchScreen,
} from '../matchHistory/MatchScreen';
import { PickBanScreen } from '../admin/PickBanScreen';
import {
    loader as playerComparisonLoader,
    PlayerComparison,
} from '../playerOverview/PlayerComparison';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Error error={'Whoops! Made a wrong turn!'} />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/matchmaker',
                element: <Matchmaker />,
            },
            {
                path: '/playerOverview',
                element: <PlayerOverview />,
            },
            {
                path: '/playerOverview/:playerId',
                loader: playerLoader,
                element: <PlayerScreen />,
            },
            {
                path: '/playerOverview/:player1Id/:player2Id',
                loader: playerComparisonLoader,
                element: <PlayerComparison />,
            },
            {
                path: '/championOverview',
                element: <ChampionOverview />,
            },
            {
                path: '/championOverview/:championId',
                loader: championLoader,
                element: <ChampionScreen />,
            },
            {
                path: '/matchHistory',
                element: <MatchHistory />,
            },
            {
                path: '/matchHistory/:matchId',
                loader: matchLoader,
                element: <MatchScreen />,
            },
            {
                path: '/beholder/:videoId',
                loader: casterLoader,
                element: <CasterScreen />,
            },
            {
                path: '/hydra',
                element: <Slideshow />,
            },
            {
                path: '/barghest',
                element: <PickBanScreen />,
            },
        ],
    },
]);
