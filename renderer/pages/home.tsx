import React from "react";
import Head from "next/head";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { styled } from "@mui/material";
import Player from "./player/index";
import { useState, useEffect } from "react";
import Config from "./config";
import { useSetAtom } from "jotai";

import { filesAtom, playlistPlayerAtom, typesAtom } from "../store/store";
import { playlistConfigAtom } from "../store/store";
import VideoFile from "../lib/model/videoFile";
import PlaylistFile from "../lib/model/playlistFile";
import PlaylistConfigSlot from "../lib/model/playlistConfigSlot";
import VideoType from "../lib/model/videoType";
import PlaylistConfig from "../lib/model/playlistConfig";
import loadConfigs from "../lib/loadConfigs";
import writeData from "../lib/writeData";
import loadTypes from "../lib/loadTypes";
import loadFiles from "../lib/loadFiles";

const Root = styled("div")(() => {
  return {
    textAlign: "center",
  };
});

export default function HomePage() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [runOnce, setRunOnce] = React.useState(false);

  const setPlaylist = useSetAtom(playlistPlayerAtom);
  const setConfigs = useSetAtom(playlistConfigAtom);
  const setFiles = useSetAtom(filesAtom);
  const setTypes = useSetAtom(typesAtom);

  function setup() {
    console.log("Setting Atoms!!");

    const tempType: VideoType = new VideoType();
    tempType.generateUUID();
    tempType.name = "TV";

    // TODO: Remove after Testing
    {
      const types: VideoType[] = new Array<VideoType>();

      const tempType3: VideoType = new VideoType();
      tempType3.generateUUID();
      tempType3.name = "Create New Type";
      types.push(tempType3);

      types.push(tempType);

      const tempType2: VideoType = new VideoType();
      tempType2.generateUUID();
      tempType2.name = "Movies";
      types.push(tempType2);

      setTypes(types);
    }

    // TODO: REMOVE AFTER TESTING
    {
      const file: VideoFile = new VideoFile();
      file.generateUUID();
      file.fileName = "Men's Fashion";
      file.filePath = "C:/mens_fashion.mp4";
      file.duration = 360;
      file.type = tempType;
      file.muted = false;
      const playlistFile: PlaylistFile = new PlaylistFile();
      playlistFile.generateUUID();
      playlistFile.file = file;
      playlistFile.timeStart = 0;
      playlistFile.timeEnd = 1410;
      playlistFile.volume = 100;

      const file1: VideoFile = new VideoFile();
      file1.generateUUID();
      file1.fileName = "Doctor Who Season 3 Episode 1";
      file1.filePath =
        "C:/Users/fang2/OneDrive/Documents/coding/RBMP/sample_video/doctor_who_3_1.mp4";
      file1.duration = 360;
      file1.type = tempType2;
      file1.muted = false;
      const playlistFile1: PlaylistFile = new PlaylistFile();
      playlistFile1.generateUUID();
      playlistFile1.file = file1;
      playlistFile1.timeStart = 1411;
      playlistFile1.timeEnd = 1439;
      playlistFile1.volume = 100;

      const temp: PlaylistFile[] = new Array<PlaylistFile>();
      temp.push(playlistFile);
      temp.push(playlistFile1);
      setPlaylist(temp);
    }

    // TODO REMOVE AFTER TESTING

    {
      const config: PlaylistConfig = new PlaylistConfig();
      config.generateUUID();
      const slots: PlaylistConfigSlot[] = new Array<PlaylistConfigSlot>();

      const tempSlot = new PlaylistConfigSlot();
      tempSlot.generateUUID();
      tempSlot.startTime = 0;
      tempSlot.endTime = 59;
      tempSlot.type = tempType;
      tempSlot.muted = false;
      tempSlot.volume = 50;
      slots.push(tempSlot);

      const tempSlot1 = new PlaylistConfigSlot();
      tempSlot1.generateUUID();
      tempSlot1.startTime = 60;
      tempSlot1.endTime = 119;
      tempSlot1.type = tempType;
      tempSlot1.muted = true;
      tempSlot1.volume = 20;
      slots.push(tempSlot1);

      const tempSlot2 = new PlaylistConfigSlot();
      tempSlot2.generateUUID();
      tempSlot2.startTime = 120;
      tempSlot2.endTime = 719;
      tempSlot2.type = tempType;
      tempSlot2.muted = false;
      tempSlot2.volume = 70;
      slots.push(tempSlot2);

      const tempSlot3 = new PlaylistConfigSlot();
      tempSlot3.generateUUID();
      tempSlot3.startTime = 720;
      tempSlot3.endTime = 889;
      tempSlot3.type = tempType;
      tempSlot3.muted = false;
      tempSlot3.volume = 100;
      slots.push(tempSlot3);

      const tempSlot4 = new PlaylistConfigSlot();
      tempSlot4.generateUUID();
      tempSlot4.startTime = 890;
      tempSlot4.endTime = 1079;
      tempSlot4.type = tempType;
      tempSlot4.muted = false;
      tempSlot4.volume = 0;
      slots.push(tempSlot4);

      const tempSlot5 = new PlaylistConfigSlot();
      tempSlot5.generateUUID();
      tempSlot5.startTime = 1080;
      tempSlot5.endTime = 1259;
      tempSlot5.type = tempType;
      tempSlot5.muted = true;
      tempSlot5.volume = 100;
      slots.push(tempSlot5);

      const tempSlot6 = new PlaylistConfigSlot();
      tempSlot6.generateUUID();
      tempSlot6.startTime = 1260;
      tempSlot6.endTime = 1439;
      tempSlot6.type = tempType;
      tempSlot6.muted = false;
      tempSlot6.volume = 10;
      slots.push(tempSlot6);

      config.slots = slots;
      config.name = "Default";
      config.start_time = 0;
      config.end_time = 1439;
      config.description = "A default configuration for testing purposes.";

      const configs = new Array<PlaylistConfig>();
      configs.push(config);
      setConfigs(configs);
    }

    // TODO: Remove after testing
    {
      const files: VideoFile[] = new Array<VideoFile>();
      files.push(file);
      files.push(file1);
      setFiles(files);
    }

    return { configs: configs, types: types, files: files };
  }

  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    setCurrentTab(newTab);
  };

  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    console.log("HOME REFRESH");

    let setupResults;

    if (!runOnce) {
      // Load configs
      loadConfigs().then((conf) => {
        if (conf.length === 0) {
          if (setupResults == null || setupResults == undefined) {
            setupResults = setup();
          }
          const configs = setupResults.configs;
          writeData("configs.conf", configs);
        } else {
          setConfigs(conf);
        }
      });

      // Load types
      loadTypes().then((t) => {
        if (t.length === 0) {
          if (setupResults == null || setupResults == undefined) {
            setupResults = setup();
          }
          const types = setupResults.types;
          writeData("types.conf", types);
        } else {
          setTypes(t);
        }
      });

      // Load files
      loadFiles().then((f) => {
        if (f.length === 0) {
          if (setupResults == null || setupResults == undefined) {
            setupResults = setup();
          }
          const files = setupResults.files;
          writeData("files.conf", files);
        } else {
          setFiles(f);
        }
      });

      setRunOnce(true);
    }

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
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}
          >
            <Tabs value={currentTab} onChange={handleTabChange} centered>
              <Tab label="Player" />
              <Tab label="Config" />
            </Tabs>
          </Box>
        </Paper>

        <Paper elevation={1} sx={{ marginLeft: 2, marginRight: 2 }}>
          {currentTab == 0 && hasWindow && <Player />}
          {currentTab == 1 && <Config />}
        </Paper>
      </Root>
    </React.Fragment>
  );
}
