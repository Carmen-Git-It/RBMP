//TODO: Remove when implemented
/* eslint no-unused-vars: 0 */

import React, { CSSProperties, useState, useEffect } from "react";

import { Button, Stack, Grid, Paper, Typography } from "@mui/material";
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

export default function Player() {
  const [fullScreen, setFullScreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [play, setPlay] = useState(false);
  // const [playlist, setPlaylist] = useState(new Array<PlaylistFile>());
  const [updatePlaylist, setUpdatePlaylist] = useState(true);
  const [day, setDay] = useState(new Date().getDate());
  const [content, setContent] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [currentMinute, setCurrentMinute] = useState(
    new Date().getHours() * 60 + new Date().getMinutes(),
  );

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
    // SetInterval this for the purposes of generating a new playlist when the day rolls over
    // const min = new Date().getHours() * 60 + new Date().getMinutes();
    // if (min !== currentMinute) {
    //   setCurrentMinute(min);
    // }
  }, []);

  useEffect(() => {
    console.log("PLAYLIST RE-RENDER");
    if (updatePlaylist) {
      // Basically force an update of the playlist atom
      // Maybe just useEffect for when the atom is updated? and update it externally? mainthread? ew then switch to electron store ig and sendevent when it's updated
    }

    const date = new Date();
    const minutes =
      date.getMinutes() + date.getHours() * 60 + date.getSeconds() / 60;

    // TODO: Track video to the correct point based on start_time vs. now

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
      } else {
        setContent("");
        setContentTitle("No video set to play at this time.");
      }
    } else {
      setContent("");
      setContentTitle("No playlist set");
    }
  }, [playlist, currentMinute]);

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
      } else {
        // TODO: Snackbar playlist generation failed
      }
    });
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
            <ReactPlayer
              className="react-player"
              url={content}
              width="100%"
              height="100%"
              muted={muted}
              style={player_style}
              playing={play}
              onEnded={handleContentEnd}
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
    </React.Fragment>
  );
}
