import React, { CSSProperties, useState } from 'react'

import { styled, Button, Box, Stack, Grid, Divider, Paper } from '@mui/material'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'

const Root = styled('div')(({ theme }) => {
    return {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    }
  })

export default function Player() {
    const [fullScreen, setFullScreen] = useState(false);
    const [muted, setMuted] = useState(false);
    const [play, setPlay] = useState(false);

    function handleFullScreenChange() {
        setFullScreen(!fullScreen);
        screenfull.request(document.querySelector(".react-player"));
    }
    
    function handleMute() {
        setMuted(!muted);
    }

    function handlePlay() {
        setPlay(!play);
    }

    //const player_style: CSSProperties = {position: 'relative'}
    const wrapper_style: CSSProperties = {position: 'relative', paddingTop: '30%'}
    const player_style: CSSProperties = {position: 'absolute', top: 0, left: 0}


    /*
<Stack direction="row" spacing="10%" divider={<Divider orientation="vertical" flexItem />} sx={{height: "100%"}}>
                <ReactPlayer
                    className="react-player"
                    url="https://www.youtube.com/watch?v=nrixfBKd64E&ab_channel=Kira"
                    style={player_style}
                    />
                
                <Paper elevation={1} sx={{position: 'relative', width: "100%"}}>
                    <Stack
                        spacing={2}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        
                        <Button variant="contained" onClick={handleFullScreenChange}>FullScreen</Button>
                    </Stack>
                </Paper>
            </Stack>
    */

    // TODO: Replace with MUI Grid or Stack, preferably stack for Player, grid for Config
    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item sm={6} md={6} style={wrapper_style}>
                    <ReactPlayer
                        className="react-player"
                        url="/videos/mens_fashion.mp4"
                        width='100%'
                        height='100%'
                        muted={muted}
                        style={player_style}
                        playing={play}
                        onEnded={handlePlay}
                        />
                </Grid>
                <Grid item sm={6} md={6}>
                    <Paper elevation={3} >
                        <Stack
                            spacing={2}
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Button variant="contained" onClick={handlePlay}>{play ? "Pause" : "Play"}</Button>
                            <Button variant="contained" onClick={handleFullScreenChange}>FullScreen</Button>
                            <Button variant="contained" onClick={handleMute}>{muted ? "Unmute" : "Mute"}</Button>
                        
                        </Stack>
                    </Paper>
                </Grid>

            </Grid>
        </React.Fragment>
    )
}