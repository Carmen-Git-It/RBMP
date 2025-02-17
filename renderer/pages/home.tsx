import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import  { Box, Tabs, Tab, Paper } from '@mui/material'
import Link from '../components/Link'
import { styled } from '@mui/material'
import Player from './player/index'
import { useState, useEffect } from 'react'
import Config from './config'
import { useSetAtom } from 'jotai'

import {playlistPlayerAtom} from '../store/store';
import { playlistConfigAtom } from '../store/store'
import VideoFile from '../lib/model/videoFile';
import PlaylistFile from '../lib/model/playlistFile';


const Root = styled('div')(({ theme }) => {
  return {
    textAlign: 'center',
  }
})

export default function HomePage() {
  const [currentTab, setCurrentTab] = React.useState(0);

  // TODO: REMOVE AFTER TESTING
  const setPlaylist = useSetAtom(playlistPlayerAtom);

  var file : VideoFile = new VideoFile();
  file.fileName = "Men's Fashion";
  file.filePath = "C:/mens_fashion.mp4";
  var playlistFile : PlaylistFile = new PlaylistFile();
  playlistFile.file = file;
  playlistFile.timeStart = 1402;
  playlistFile.timeEnd = 1410;
  playlistFile.volume = 100;

  var file1 : VideoFile = new VideoFile();
  file1.fileName = "Doctor Who Season 3 Episode 1";
  file1.filePath = "C:/Users/fang2/OneDrive/Documents/coding/RBMP/sample_video/doctor_who_3_1.mp4";
  var playlistFile1 : PlaylistFile = new PlaylistFile();
  playlistFile1.file = file1;
  playlistFile1.timeStart = 1411;
  playlistFile1.timeEnd = 1439;
  playlistFile1.volume = 100;

  var temp : Array<PlaylistFile> = new Array<PlaylistFile>();
  temp.push(playlistFile);
  temp.push(playlistFile1);
  setPlaylist(temp);

  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    setCurrentTab(newTab);
  };

  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    console.log("HOME REFRESH");
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>RBMS</title>
      </Head>
      <Root>
        <Paper elevation={6}>
          <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 3}}>
            <Tabs value={currentTab} onChange={handleTabChange} centered >
              <Tab label="Player" />
              <Tab label="Config" />
            </Tabs>
          </Box>
        </Paper>
        
        <Paper elevation={1} sx={{marginLeft: 2, marginRight: 2}}>
          {currentTab == 0 && hasWindow && <Player/>}
          {currentTab == 1 && <Config/>}
        </Paper>
      </Root>
    </React.Fragment>
  )
}
