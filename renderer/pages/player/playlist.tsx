import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import { playlistPlayerAtom } from "../../store/store";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function PlaylistView() {
  const playlist = useAtomValue(playlistPlayerAtom);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    if (playlist) {
      const arr = new Array<Boolean>(playlist.slots.length);
      arr.fill(false);
      setExpanded(arr);
    }
  }, [playlist]);

  function handleExpand(key: number) {
    const arr = expanded.slice();
    arr[key] = !arr[key];
    setExpanded(arr);
  }

  function padNumber(val: number) {
    return val > 9 ? val : "0" + val;
  }

  // TODO: Make this pretty, add slot regeneration

  return (
    <Box sx={{ maxHeight: "80%", overflow: "auto", width: "100%" }}>
      {playlist &&
        playlist.slots.map((slot, key) => {
          return (
            <Box
              key={key}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                marginBottom: 3,
                paddingTop: 1,
                paddingRight: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginLeft: "20%", marginRight: "20%" }}
              >
                <Typography variant="h5">
                  Slot {key} |{" "}
                  {padNumber(Math.floor(slot.startTime / 60)) +
                    ":" +
                    padNumber(Math.floor(slot.startTime % 60)) +
                    " - " +
                    padNumber(Math.floor(slot.endTime / 60)) +
                    ":" +
                    padNumber(Math.floor(slot.endTime % 60))}
                </Typography>
                <Button variant="outlined" onClick={() => handleExpand(key)}>
                  {expanded[key] ? "-" : "+"}
                </Button>
              </Stack>
              <List sx={{ width: "100%", marginLeft: 1 }}>
                {expanded[key] &&
                  slot.files.map((file, fileKey) => {
                    return (
                      <Paper elevation={5}>
                        <ListItem key={fileKey + 1000}>
                          <ListItemText
                            primary={file.file.fileName}
                            secondary={
                              padNumber(Math.floor(file.timeStart / 60)) +
                              ":" +
                              padNumber(Math.floor(file.timeStart % 60)) +
                              " - " +
                              padNumber(Math.floor(file.timeEnd / 60)) +
                              ":" +
                              padNumber(Math.floor(file.timeEnd % 60))
                            }
                          ></ListItemText>
                        </ListItem>
                        <Divider orientation="horizontal" flexItem />
                      </Paper>
                    );
                  })}
              </List>
            </Box>
          );
        })}
    </Box>
  );
}
