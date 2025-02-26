import {
  Typography,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  currentPlaylistConfigIdAtom,
  playlistConfigAtom,
} from "../../store/store";
import writeData from "../../lib/writeData";
import FilesConfig from "./filesConfig";
import Slots from "./slots";
import VideoType from "../../lib/model/videoType";

// TODO: Refactor this monstrosity

export default function Config() {
  const [configs, setConfigs] = useAtom(playlistConfigAtom);

  const [startMinutes, setStartMinutes] = useState(new Array(100));
  const [startHours, setStartHours] = useState(new Array(100)); // TODO: Add and remove array entries manually on config load and slot modification.
  const [endMinutes, setEndMinutes] = useState(new Array(100));
  const [endHours, setEndHours] = useState(new Array(100));
  const [slotTypes, setSlotTypes] = useState(new Array<VideoType>(100));

  console.log("CONFIG RENDERER + " + configs);
  const [currentConfig, setCurrentConfig] = useAtom(
    currentPlaylistConfigIdAtom,
  );

  const [name, setName] = useState(configs[currentConfig].name);
  const [description, setDescription] = useState(
    configs[currentConfig].description,
  );

  function handleChangeCurrentConfig(e: SelectChangeEvent) {
    setCurrentConfig(Number.parseInt(e.target.value));
  }

  function handleSaveConfig() {
    const tempConfigs = configs.slice();
    for (let i = 0; i < tempConfigs[currentConfig].slots.length; i++) {
      // Start time
      if (startMinutes[i] !== undefined && startHours[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].startTime =
          startMinutes[i] + startHours[i] * 60;
      } else if (startMinutes[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].startTime =
          (tempConfigs[currentConfig].slots[i].startTime % 60) +
          startMinutes[i];
      } else if (startHours[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].startTime =
          Math.floor(tempConfigs[currentConfig].slots[i].startTime / 60) +
          startHours[i] * 60;
      }
      // End time
      if (endMinutes[i] !== undefined && endHours[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].endTime =
          endMinutes[i] + endHours[i] * 60; // TODO: Deal with unchanged values
      } else if (endMinutes[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].endTime =
          (tempConfigs[currentConfig].slots[i].endTime % 60) + endMinutes[i];
      } else if (endHours[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].endTime =
          Math.floor(tempConfigs[currentConfig].slots[i].endTime / 60) +
          endHours[i] * 60;
      }
      // Type
      if (slotTypes[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].type = slotTypes[i];
      }
    }

    tempConfigs[currentConfig].name = name;
    tempConfigs[currentConfig].description = description;
    setConfigs(tempConfigs);
    writeData("configs.conf", tempConfigs);
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom sx={{ paddingTop: 2 }}>
        Config
      </Typography>
      <Grid container spacing={2} sx={{ paddingBottom: 1 }}>
        <Grid item md={6}>
          <Paper
            elevation={3}
            sx={{ padding: 2, maxHeight: 550, overflow: "auto" }}
          >
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="current-config-select-label">
                  Current Configuration
                </InputLabel>
                <Select
                  labelId="current-config-select-label"
                  id="current-config-select"
                  value={currentConfig.toLocaleString()}
                  label="Current Configuration"
                  onChange={handleChangeCurrentConfig}
                >
                  {configs.map((config, key) => (
                    <MenuItem key={key} value={key}>
                      {config.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  marginBottom: 3,
                  paddingTop: 1,
                  paddingRight: 2,
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    id="config-name"
                    label="Name"
                    variant="outlined"
                    defaultValue={configs[currentConfig].name}
                    onChange={handleChangeName}
                    error={name === ""}
                    helperText={name === "" ? "Name must not be empty" : ""}
                  />
                  <TextField
                    id="config-description"
                    label="Description"
                    variant="outlined"
                    defaultValue={configs[currentConfig].description}
                    multiline
                    onChange={handleChangeDescription}
                  />
                  <Paper elevation={6}>
                    <Slots
                      startMinutes={startMinutes}
                      setStartMinutes={setStartMinutes}
                      startHours={startHours}
                      setStartHours={setStartHours}
                      endMinutes={endMinutes}
                      setEndMinutes={setEndMinutes}
                      endHours={endHours}
                      setEndHours={setEndHours}
                      slotTypes={slotTypes}
                      setSlotTypes={setSlotTypes}
                    />
                  </Paper>
                  <Button
                    onClick={handleSaveConfig}
                    variant="outlined"
                    color="success"
                    sx={{ width: "100%" }}
                  >
                    Save
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item md={6}>
          <FilesConfig></FilesConfig>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
