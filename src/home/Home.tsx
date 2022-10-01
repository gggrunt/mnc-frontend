const backgroundVideo =
    'https://blitz-cdn-videos.blitz.gg/ui/video/Homepage-Slide-One.webm';
// 'https://screensavers.riotgames.com/v2/latest/content/original/AnimatedArt/animated-freljord.webm';

export default function Home() {
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#282c34',
                margin: -16,
                position: 'relative',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                }}
            >
                <video
                    autoPlay={true}
                    loop={true}
                    muted={true}
                    playsInline={true}
                    preload='none'
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                >
                    <source type='video/webm' src={backgroundVideo} />
                </video>
            </div>
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
                <h1
                    style={{
                        color: 'white',
                        fontSize: 48,
                        marginRight: 64,
                        marginLeft: 64,
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                    }}
                >
                    WELCOME TO MONDAY NIGHT CUSTOMS!
                </h1>
            </div>
        </div>
    );
}
