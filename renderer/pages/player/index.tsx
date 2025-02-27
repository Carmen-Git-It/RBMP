import React, { CSSProperties, useState, useEffect, useRef } from "react";

import {
  Button,
  Stack,
  Grid,
  Paper,
  Typography,
  Snackbar,
} from "@mui/material";
import screenfull from "screenfull";
import ReactPlayer from "react-player";
import { useAtom, useAtomValue } from "jotai";
import {
  currentPlaylistConfigIdAtom,
  filesAtom,
  playlistConfigAtom,
  playlistPlayerAtom,
} from "../../store/store";
import PlaylistFile from "../../lib/model/playlistFile";
import PlaylistSlot from "../../lib/model/playlistSlot";
import generatePlaylist from "../../lib/generatePlaylist";
import VPlayer from "./player";
import writeData from "../../lib/writeData";
import dayjs from "dayjs";

export default function Player() {
  const [fullScreen, setFullScreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [play, setPlay] = useState(true);
  const [content, setContent] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [intervalTick, setIntervalTick] = useState(false);
  const player = useRef<ReactPlayer>();
  const [isReady, setIsReady] = useState(true);
  const [currentFile, setCurrentFile] = useState<PlaylistFile>();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [playlist, setPlaylist] = useAtom(playlistPlayerAtom);
  const configs = useAtomValue(playlistConfigAtom);
  const currentConfig = useAtomValue(currentPlaylistConfigIdAtom); // This is really just the index in the current array of configs, not the id, TODO: Change this
  const files = useAtomValue(filesAtom);

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

    if (hasWindow && (!playlist || playlist == undefined)) {
      handleMakePlaylist();
    }

    return () => setHasWindow(false);
  }, []);

  // Once per minute, check to see if the day has changed over yet.
  // If it has, generate a new playlist.
  useEffect(() => {
    if (hasWindow) {
      const interval = setInterval(() => {
        setIntervalTick(!intervalTick);
      }, 60000);

      if (playlist !== undefined && dayjs().date() !== playlist.date.date()) {
        handleMakePlaylist();
      }

      return () => clearInterval(interval);
    }
  }, [intervalTick]);

  useEffect(() => {
    if (hasWindow && playlist !== undefined && currentFile !== undefined) {
      setIsReady(false);
    }
  }, [hasWindow]);

  useEffect(() => {
    console.log("PLAYLIST RE-RENDER");

    const date = new Date();
    const minutes =
      date.getMinutes() + date.getHours() * 60 + date.getSeconds() / 60;

    if (playlist !== null && playlist !== undefined) {
      const slots = playlist.slots.filter((item: PlaylistSlot) => {
        return item.startTime < minutes && item.endTime > minutes;
      })[0];

      const video = slots.files.filter((item: PlaylistFile) => {
        return item.timeStart < minutes && item.timeEnd > minutes;
      })[0];

      if (video) {
        setContent("file://" + video.file.filePath);
        setContentTitle(video.file.fileName + "");
        setCurrentFile(video);
        setIsReady(false);
      } else {
        setContent("");
        setContentTitle("No video set to play at this time.");
      }
    } else {
      setContent("");
      setContentTitle("No playlist set");
    }
  }, [playlist]);

  // Track the video to the correct time
  useEffect(() => {
    if (!isReady && hasWindow) {
      console.log("Not ready");
      if (player.current) {
        const date = new Date();
        const minutes =
          date.getMinutes() + date.getHours() * 60 + date.getSeconds() / 60;
        if ((minutes - currentFile.timeStart) * 60 > 10) {
          console.log("seeking to: " + (minutes - currentFile.timeStart) * 60);
          player?.current?.seekTo((minutes - currentFile.timeStart) * 60);
        }
      }
    }
    setIsReady(true);
  }, [isReady]);

  function handleContentEnd() {
    const date = new Date();
    const minutes =
      date.getMinutes() + date.getHours() * 60 + date.getSeconds() / 60;

    // +/- 1 on the time to account for seconds being factored into playlist generation
    const slots = playlist.slots.filter((item: PlaylistSlot) => {
      return item.startTime < minutes && item.endTime + 0.5 > minutes;
    })[0];

    const video = slots.files.filter((item: PlaylistFile) => {
      return item.timeStart < minutes && item.timeEnd > minutes;
    })[0];

    if (video) {
      setContent("file://" + video.file.filePath);
      setContentTitle(video.file.fileName + "");
      setCurrentFile(video);
      setIsReady(false);
    } else {
      setContent("");
      setContentTitle("No video set to play at this time.");
    }
  }

  function handleMute() {
    setMuted(!muted);
  }

  function handlePlay() {
    setPlay(!play);
  }

  function handleMakePlaylist() {
    generatePlaylist(configs[currentConfig], files).then((p) => {
      if (p) {
        setPlaylist(p);
        writeData("playlist.conf", p);
      } else {
        setSnackbarMessage("Error: Problem generating snackbar");
        setSnackbarOpen(true);
      }
    });
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  const wrapper_style: CSSProperties = {
    position: "relative",
    paddingTop: "30%",
  };
  const player_style: CSSProperties = { position: "absolute", top: 0, left: 0 };

  return (
    <React.Fragment>
      <Grid container spacing={0}>
        <Grid item sm={6} md={6} style={wrapper_style}>
          {hasWindow && (
            <VPlayer
              player={player}
              content={content}
              muted={muted}
              player_style={player_style}
              play={play}
              handleContentEnd={handleContentEnd}
            />
          )}
        </Grid>
        <Grid item sm={6} md={6}>
          <Paper elevation={3}>
            <Stack
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">
                {contentTitle.length > 0
                  ? contentTitle
                  : "No video set to play at this time."}
              </Typography>
              <Button variant="outlined" onClick={handleMakePlaylist}>
                Generate New Playlist
              </Button>
              <Button variant="contained" onClick={handlePlay}>
                {play ? "Pause" : "Play"}
              </Button>
              <Button variant="contained" onClick={handleFullScreenChange}>
                FullScreen
              </Button>
              <Button variant="contained" onClick={handleMute}>
                {muted ? "Unmute" : "Mute"}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </React.Fragment>
  );
}
