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
import PlaylistSlot from '../lib/model/playlistSlot'
import VideoType from '../lib/model/videoType'
import PlaylistConfig from '../lib/model/playlistConfig'


const Root = styled('div')(({ theme }) => {
  return {
    textAlign: 'center',
  }
})

export default function HomePage() {
  const [currentTab, setCurrentTab] = React.useState(0);

  // TODO: REMOVE AFTER TESTING
  const setPlaylist = useSetAtom(playlistPlayerAtom);
  {
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
  }

  // TODO REMOVE AFTER TESTING
  const setConfigs = useSetAtom(playlistConfigAtom);
  var tempType : VideoType = new VideoType();
  tempType.id = 0;
  tempType.name = "TV";
  {
    var config : PlaylistConfig = new PlaylistConfig();
    var slots : Array<PlaylistSlot> = new Array<PlaylistSlot>();
    
    var tempSlot = new PlaylistSlot();
    tempSlot.startTime = 0;
    tempSlot.endTime = 59;
    tempSlot.type = tempType;
    tempSlot.muted = false;
    tempSlot.volume = 50;
    slots.push(tempSlot);
    
    var tempSlot1 = new PlaylistSlot();
    tempSlot1.startTime = 60;
    tempSlot1.endTime = 119;
    tempSlot1.type = tempType;
    tempSlot1.muted = true;
    tempSlot1.volume = 20;
    slots.push(tempSlot1);

    var tempSlot2 = new PlaylistSlot();
    tempSlot2.startTime = 120;
    tempSlot2.endTime = 719;
    tempSlot2.type = tempType;
    tempSlot2.muted = false;
    tempSlot2.volume = 70;
    slots.push(tempSlot2);

    var tempSlot3 = new PlaylistSlot();
    tempSlot3.startTime = 720;
    tempSlot3.endTime = 889;
    tempSlot3.type = tempType;
    tempSlot3.muted = false;
    tempSlot3.volume = 100;
    slots.push(tempSlot3);

    var tempSlot4 = new PlaylistSlot();
    tempSlot4.startTime = 890;
    tempSlot4.endTime = 1079;
    tempSlot4.type = tempType;
    tempSlot4.muted = false;
    tempSlot4.volume = 0;
    slots.push(tempSlot4);

    var tempSlot5 = new PlaylistSlot();
    tempSlot5.startTime = 1080;
    tempSlot5.endTime = 1259;
    tempSlot5.type = tempType;
    tempSlot5.muted = true;
    tempSlot5.volume = 100;
    slots.push(tempSlot5);

    var tempSlot6 = new PlaylistSlot();
    tempSlot6.startTime = 1260;
    tempSlot6.endTime = 1440;
    tempSlot6.type = tempType;
    tempSlot6.muted = false;
    tempSlot6.volume = 10;
    slots.push(tempSlot6);

    config.slots = slots;
    config.name = "Default";
    config.id = 0;
    config.start_time = 0;
    config.end_time = 1440;
    config.description = "A default configuration for testing purposes.";

    var configs = new Array<PlaylistConfig>()
    configs.push(config);
    setConfigs(configs);
  }

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
