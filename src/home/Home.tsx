import { Button, Flex, Heading } from '@chakra-ui/react';
import { FiArrowRight, FiTwitch, FiYoutube } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { NewsCards } from '../news/NewsCards';
import { useCountdown } from '../utils/useCountdown';
import mnc_text_logo from '../assets/mnc_text_logo.png';
import season_1_transparent from '../assets/season_1_transparent.png';
import background from '../assets/background.webp';

const backgroundVideo = background;
//'https://cdn.discordapp.com/attachments/972956581220192346/1032190900295716974/Neon_-_21368_VP9.webm';
//'https://blitz-cdn-videos.blitz.gg/ui/video/Homepage-Slide-One.webm';
// 'https://screensavers.riotgames.com/v2/latest/content/original/AnimatedArt/animated-freljord.webm';
//https://screensavers.riotgames.com/v2/latest/content/original/AnimatedArt/arcade-animated-02.webm

const generalLogo = mnc_text_logo;
const season1Logo = season_1_transparent;

export default function Home() {
    const navigate = useNavigate();

    const navigateToNews = () => {
        navigate('/news');
    };

    const countdown = useCountdown(new Date(2022, 10, 14, 22));

    const hideCountdown =
        countdown[0] <= 0 &&
        countdown[1] <= 0 &&
        countdown[2] <= 0 &&
        countdown[3] <= 0;

    return (
        <Flex
            style={{
                minHeight: '90vh',
                backgroundColor: '#282c34',
                margin: -16,
                position: 'relative',
            }}
            flexDirection='column'
        >
            <Flex flex='1' minHeight='50vh' alignSelf='stretch'>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                    }}
                >
                    <img
                        src={backgroundVideo}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src={generalLogo}
                            style={{ height: '80%' }}
                            alt='MNC Logo'
                        />
                        {!hideCountdown ? (
                            <>
                                <h1
                                    style={{
                                        color: 'white',
                                        fontSize: '2em',
                                        marginRight: 64,
                                        marginLeft: 64,
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {`${countdown[0].toLocaleString('en-US', {
                                        minimumIntegerDigits: 2,
                                        useGrouping: false,
                                    })} : ${countdown[1].toLocaleString(
                                        'en-US',
                                        {
                                            minimumIntegerDigits: 2,
                                            useGrouping: false,
                                        }
                                    )} : ${countdown[2].toLocaleString(
                                        'en-US',
                                        {
                                            minimumIntegerDigits: 2,
                                            useGrouping: false,
                                        }
                                    )} : ${countdown[3].toLocaleString(
                                        'en-US',
                                        {
                                            minimumIntegerDigits: 2,
                                            useGrouping: false,
                                        }
                                    )}`}
                                </h1>
                                <h1
                                    style={{
                                        color: 'white',
                                        fontSize: 20,
                                        marginRight: 64,
                                        marginLeft: 64,
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {`STARTS NOVEMBER 14`}
                                </h1>
                            </>
                        ) : null}
                    </div>
                </div>
            </Flex>
            <Flex
                backgroundColor='white'
                flexDirection='column'
                alignItems='center'
                paddingTop='4'
                paddingBottom='4'
            >
                <Flex maxWidth='1024px' flexDirection='column' wrap='wrap'>
                    <Button
                        variant='ghost'
                        flex={1}
                        padding={1}
                        size='md'
                        alignSelf={'flex-end'}
                        marginBottom='4'
                        marginRight='1'
                        flexDirection='row'
                        onClick={navigateToNews}
                    >
                        <Flex alignItems='center'>
                            <h1>All News</h1>
                            <FiArrowRight />
                        </Flex>
                    </Button>
                    <Flex wrap='wrap' flexDirection='row'>
                        <NewsCards />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
