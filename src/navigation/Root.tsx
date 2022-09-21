import { useCallback, useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

import './Root.css'
import CSS from 'csstype'

const baseSideBarStyle: CSS.Properties = {
    height: '100%' /* 100% Full-height */,
    position: 'fixed' /* Stay in place */,
    zIndex: 1 /* Stay on top */,
    top: 0 /* Stay at the top */,
    left: 0,
    backgroundColor: '#111' /* Black*/,
    overflowX: 'hidden' /* Disable horizontal scroll */,
    paddingTop: '60px' /* Place content 60px from the top */,
    transition:
        '0.5s' /* 0.5 second transition effect to slide in the sidenav */,
}

const sideBarStyle: CSS.Properties = {
    ...baseSideBarStyle,
    width: '300px' /* 0 width - change this with JavaScript */,
}

const sideBarCollapsedStyle: CSS.Properties = {
    ...baseSideBarStyle,
    width: '0px' /* 0 width - change this with JavaScript */,
}

const openMenuIcon: CSS.Properties = {
    flex: 1,
    fontSize: '36px',
    marginLeft: '50px',
    paddingTop: '16px',
    textDecoration: 'none',
    color: '#818181',
    transition: '0.3s',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    maxWidth: '64px',
    borderWidth: 0,
    backgroundColor: 'transparent',
}

const sideBarClose: CSS.Properties = {
    position: 'absolute',
    top: 0,
    right: '25px',
    fontSize: '36px',
    marginLeft: '50px',
    padding: '8px 8px 8px 32px',
    textDecoration: 'none',
    color: '#818181',
    display: 'block',
    transition: '0.3s',
    borderWidth: 0,
    backgroundColor: 'transparent',
}

function NavigationItem({
    route,
    label,
    onClickCallback,
}: {
    route: string
    label: string
    onClickCallback?: () => void
}) {
    const navigate = useNavigate()

    const onClick = useCallback(() => {
        navigate(route)
        if (onClickCallback) {
            onClickCallback()
        }
    }, [route, navigate, onClickCallback])

    return (
        <button
            onClick={onClick}
            style={{ backgroundColor: 'transparent', borderWidth: 0 }}
        >
            <a style={{ minWidth: 500, textAlign: 'left' }}>{label}</a>
        </button>
    )
}

export const TOP_NAV_BAR_HEIGHT = 80

export default function Root() {
    const [isNavigationCollapsed, setIsNavigationCollapsed] =
        useState<boolean>(true)

    const onToggleNavigation = () => {
        setIsNavigationCollapsed(!isNavigationCollapsed)
    }

    return (
        <>
            <div
                id='mySidenav'
                className='sidenav'
                style={
                    isNavigationCollapsed ? sideBarCollapsedStyle : sideBarStyle
                }
            >
                {!isNavigationCollapsed ? (
                    <>
                        <button
                            onClick={onToggleNavigation}
                            style={sideBarClose}
                        >
                            <a>
                                <AiOutlineClose />
                            </a>
                        </button>
                        <NavigationItem
                            label='Home'
                            route='/'
                            onClickCallback={onToggleNavigation}
                        />
                        <NavigationItem
                            label='Player Overview'
                            route='/playerOverview'
                            onClickCallback={onToggleNavigation}
                        />
                        <NavigationItem
                            label='Champion Overview'
                            route='/championOverview'
                            onClickCallback={onToggleNavigation}
                        />
                        <NavigationItem
                            label='Matchmaker'
                            route='/matchmaker'
                            onClickCallback={onToggleNavigation}
                        />
                    </>
                ) : null}
            </div>
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    width: '100%',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minHeight: TOP_NAV_BAR_HEIGHT,
                    }}
                >
                    <button style={openMenuIcon} onClick={onToggleNavigation}>
                        <a>
                            <AiOutlineMenu />
                        </a>
                    </button>
                    <h1 style={{ flex: 0, minWidth: 300 }}>
                        Monday Night Customs Hub
                    </h1>
                </div>
                <Outlet />
            </div>
        </>
    )
}
