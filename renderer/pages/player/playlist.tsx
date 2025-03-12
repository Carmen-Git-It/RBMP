import React, { useEffect, useState } from "react";
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
import PlaylistSlot from "../../lib/model/playlistSlot";

export default function PlaylistView({ playlistSlots }) {
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    if (playlistSlots !== undefined) {
      const arr = new Array<Boolean>(playlistSlots.length);
      arr.fill(false);
      setExpanded(arr);
    }
  }, [playlistSlots]);

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
    <Box sx={{ maxHeight: "75%", overflow: "auto", width: "100%" }}>
      {playlistSlots !== undefined &&
        playlistSlots.length > 0 &&
        playlistSlots.map((slot: PlaylistSlot, key: number) => {
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
                      <Paper elevation={5} key={fileKey + 1000}>
                        <ListItem>
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
