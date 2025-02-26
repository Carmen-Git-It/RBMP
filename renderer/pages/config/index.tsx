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
import React, { useEffect, useState } from "react";
import {
  currentPlaylistConfigIdAtom,
  playlistConfigAtom,
} from "../../store/store";
import writeData from "../../lib/writeData";
import FilesConfig from "./filesConfig";
import Slots from "./slots";
import VideoType from "../../lib/model/videoType";
import { Dayjs } from "dayjs";

// TODO: Refactor this monstrosity

export default function Config() {
  const [configs, setConfigs] = useAtom(playlistConfigAtom);
  const [currentConfig, setCurrentConfig] = useAtom(
    currentPlaylistConfigIdAtom,
  );
  const [startTimes, setStartTimes] = useState(new Array<Dayjs>());
  const [endTimes, setEndTimes] = useState(new Array<Dayjs>());
  const [slotTypes, setSlotTypes] = useState(new Array<VideoType>(100));
  const [name, setName] = useState(configs[currentConfig].name);
  const [description, setDescription] = useState(
    configs[currentConfig].description,
  );

  useEffect(() => {
    if (startTimes.length === 0) {
      const tempArr = new Array<Dayjs>(configs[currentConfig].slots.length);
      setStartTimes(tempArr);
    }
    if (endTimes.length === 0) {
      const tempArr = new Array<Dayjs>(configs[currentConfig].slots.length);
      setEndTimes(tempArr);
    }
  }, []);

  function setSlotTimeArrLength() {
    const tempStarts = new Array<Dayjs>(configs[currentConfig].slots.length);
    setStartTimes(tempStarts);
    const tempEnds = new Array<Dayjs>(configs[currentConfig].slots.length);
    setEndTimes(tempEnds);
  }

  function handleChangeCurrentConfig(e: SelectChangeEvent) {
    setCurrentConfig(Number.parseInt(e.target.value));
    setSlotTimeArrLength();
  }

  function handleSaveConfig() {
    const tempConfigs = configs.slice();
    for (let i = 0; i < tempConfigs[currentConfig].slots.length; i++) {
      // Start time
      if (startTimes[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].startTime =
          startTimes[i].get("minutes") + startTimes[i].get("hours") * 60;
      }
      // End time
      if (endTimes[i] !== undefined) {
        tempConfigs[currentConfig].slots[i].endTime =
          endTimes[i].get("minutes") + endTimes[i].get("hours") * 60;
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
                      startTimes={startTimes}
                      setStartTimes={setStartTimes}
                      endTimes={endTimes}
                      setEndTimes={setEndTimes}
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
