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
                path: '/championOverview',
                element: <ChampionOverview />,
            },
            {
                path: '/championOverview/:championId',
                loader: championLoader,
                element: <ChampionScreen />,
            },
            {
                path: '/beholder/:videoId',
                loader: casterLoader,
                element: <CasterScreen />,
            },
        ],
    },
]);
