import React, { CSSProperties, useState, useEffect } from 'react'

import { styled, Button, Box, Stack, Grid, Divider, Paper, Typography } from '@mui/material'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import { useAtomValue } from 'jotai'
import {playlistPlayerAtom} from '../../store/store'
import PlaylistFile from '../../lib/model/playlistFile'

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
    // const [playlist, setPlaylist] = useState(new Array<PlaylistFile>());
    const [updatePlaylist, setUpdatePlaylist] = useState(true);
    const [day, setDay] = useState(new Date().getDate());
    const [content, setContent] = useState('')
    const [contentTitle, setContentTitle] = useState("");
    const [currentMinute, setCurrentMinute] = useState(new Date().getHours() * 60 + new Date().getMinutes());

    const playlist = useAtomValue(playlistPlayerAtom);

    function handleFullScreenChange() {
        setFullScreen(!fullScreen);
        screenfull.request(document.querySelector(".react-player"));
    }

    const [hasWindow, setHasWindow] = useState(false);
    useEffect(() => {
        console.log("WINDOW RE-RENDER");
        if (typeof window !== "undefined") {
            setHasWindow(true);
        }
        var min = new Date().getHours() * 60 + new Date().getMinutes();
        if (min !== currentMinute) {
            setCurrentMinute(min);
        }
    }, []);

    useEffect(() => {
        console.log("PLAYLIST RE-RENDER");
        if (updatePlaylist) {
            // TODO: Make this an API call? Get it from a /lib/ function?
            // Basically force an update of the playlist atom
            // Change day, reset setPlaylist
            // Maybe just useEffect for when the atom is updated? and update it externally? mainthread? ew then switch to electron store ig and sendevent when it's updated
        }
    
        var date = new Date();
        var minutes = date.getMinutes() + (date.getHours() * 60);
    
        // TODO: Track video to the correct point based on start_time vs. now

        var video = playlist.filter((item : PlaylistFile) => {
            return item.timeStart < minutes && item.timeEnd > minutes;
        })[0];
    
        if (!video == null && content.localeCompare("file://" + video.file.filePath) !== 0) {
            setContent("file://" + video.file.filePath);
            setContentTitle(video.file.fileName + "");
        } else if(video == null) {
            setContent("");
            setContentTitle("No video set to play at this time.");
        }
    }, [playlist, currentMinute])
    
    function handleMute() {
        setMuted(!muted);
    }

    function handlePlay() {
        setPlay(!play);
    }

    const wrapper_style: CSSProperties = {position: 'relative', paddingTop: '30%'}
    const player_style: CSSProperties = {position: 'absolute', top: 0, left: 0}

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item sm={6} md={6} style={wrapper_style}>
                    {hasWindow && <ReactPlayer
                        className="react-player"
                        url={content}
                        width='100%'
                        height='100%'
                        muted={muted}
                        style={player_style}
                        playing={play}
                        onEnded={handlePlay}
                        />}
                </Grid>
                <Grid item sm={6} md={6}>
                    <Paper elevation={3} >
                        <Stack
                            spacing={2}
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Typography variant="h5">{contentTitle.length > 0 ? contentTitle : "No video set to play at this time."}</Typography>
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