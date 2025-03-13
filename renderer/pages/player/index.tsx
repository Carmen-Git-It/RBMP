import React, { CSSProperties, useState, useEffect, useRef } from "react";

import {
  Button,
  Stack,
  Grid,
  Paper,
  Typography,
  Snackbar,
} from "@mui/material";
import ReactPlayer from "react-player";
import { useAtom, useAtomValue } from "jotai";
import {
  currentPlaylistConfigIdAtom,
  filesAtom,
  fillerAtom,
  playlistConfigAtom,
  playlistPlayerAtom,
} from "../../store/store";
import PlaylistFile from "../../lib/model/playlistFile";
import PlaylistSlot from "../../lib/model/playlistSlot";
import generatePlaylist from "../../lib/generatePlaylist";
import VPlayer from "./player";
import writeData from "../../lib/writeData";
import dayjs from "dayjs";
import PlaylistView from "./playlist";

export default function Player() {
  const [playing, setPlaying] = useState(true);
  const [content, setContent] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [intervalTick, setIntervalTick] = useState(false);
  const player = useRef<ReactPlayer>();
  const [isReady, setIsReady] = useState(true);
  const [paused, setPaused] = useState(false);
  const [height, setHeight] = useState(0);
  const [currentFile, setCurrentFile] = useState<PlaylistFile>();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fillerType = useAtomValue(fillerAtom);
  const [playlist, setPlaylist] = useAtom(playlistPlayerAtom);
  const configs = useAtomValue(playlistConfigAtom);
  const currentConfig = useAtomValue(currentPlaylistConfigIdAtom); // This is really just the index in the current array of configs, not the id, TODO: Change this
  const files = useAtomValue(filesAtom);

  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    console.log("WINDOW RE-RENDER");
    console.log("HEIGHT: " + height);
    if (typeof window !== "undefined") {
      setHeight(window.innerHeight - 100);
      window.addEventListener("resize", () => {
        setHeight(window.innerHeight - 100);
      });
      setHasWindow(true);
    }

    if (hasWindow && (!playlist || playlist == undefined)) {
      handleMakePlaylist();
    }

    setPlaying(true);

    return () => {
      setHasWindow(false);
      window.removeEventListener("resize", () => {
        setHeight(window.innerHeight - 100);
      });
    };
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

  // Seek on window change if focus changes back
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

      if (
        slots !== undefined &&
        slots.files !== undefined &&
        slots.files.length > 0
      ) {
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

  function handleMakePlaylist() {
    generatePlaylist(configs[currentConfig], files, fillerType).then((p) => {
      if (p) {
        setPlaylist(p);
        writeData("playlist.conf", p);
      } else {
        setSnackbarMessage("Error: Problem generating playlist");
        setSnackbarOpen(true);
      }
    });
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  function handleResume() {
    if (paused) {
      setIsReady(false);
      setPaused(false);
    }
  }

  function handlePause() {
    setPaused(true);
  }

  const wrapper_style: CSSProperties = {
    position: "relative",
    paddingTop: "30%",
  };
  const player_style: CSSProperties = { position: "absolute", top: 0, left: 0 };

  return (
    <React.Fragment>
      {hasWindow && (
        <Grid container spacing={0} sx={{ height: height }}>
          <Grid item xs={12} md={6} style={wrapper_style}>
            {hasWindow && (
              <VPlayer
                player={player}
                content={content}
                muted={currentFile ? currentFile.muted : false}
                player_style={player_style}
                handleContentEnd={handleContentEnd}
                onResume={handleResume}
                onPause={handlePause}
                play={playing}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <Stack
                spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: height,
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
                <PlaylistView
                  playlistSlots={
                    playlist !== undefined ? playlist.slots.slice() : undefined
                  }
                ></PlaylistView>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </React.Fragment>
  );
}
