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
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import {
  currentPlaylistConfigIdAtom,
  playlistConfigAtom,
  typesAtom,
} from "../../store/store";
import writeData from "../../lib/writeData";
import FilesConfig from "./filesConfig";
import Slots from "./slots";
import VideoType from "../../lib/model/videoType";
import { Dayjs } from "dayjs";
import PlaylistConfig from "../../lib/model/playlistConfig";
import PlaylistConfigSlot from "../../lib/model/playlistConfigSlot";
import FillerContentType from "./fillerContentType";

// TODO: Filler type
// TODO: MaxHeight based on window height for better fullscreen

export default function Config() {
  const types = useAtomValue(typesAtom);
  const [configs, setConfigs] = useAtom(playlistConfigAtom);
  const [currentConfigIndex, setCurrentConfigIndex] = useAtom(
    currentPlaylistConfigIdAtom,
  );
  const [currentConfig, setCurrentConfig] = useState(
    configs[currentConfigIndex],
  );
  const [startTimes, setStartTimes] = useState(new Array<Dayjs>());
  const [endTimes, setEndTimes] = useState(new Array<Dayjs>());
  const [featured, setFeatured] = useState(new Array<boolean>());
  const [slotTypes, setSlotTypes] = useState(new Array<VideoType>());
  const [name, setName] = useState(configs[currentConfigIndex].name);
  const [newConfig, setNewConfig] = useState(false);
  const [description, setDescription] = useState(
    configs[currentConfigIndex].description,
  );

  useEffect(() => {
    if (startTimes.length === 0) {
      const tempArr = new Array<Dayjs>(
        configs[currentConfigIndex].slots.length,
      );
      setStartTimes(tempArr);
    }
    if (endTimes.length === 0) {
      const tempArr = new Array<Dayjs>(
        configs[currentConfigIndex].slots.length,
      );
      setEndTimes(tempArr);
    }
    if (slotTypes.length === 0) {
      const tempTypes = new Array<VideoType>(
        configs[currentConfigIndex].slots.length,
      );
      setSlotTypes(tempTypes);
    }
    if (featured.length === 0) {
      const tempFeatured = new Array<boolean>(
        configs[currentConfigIndex].slots.length,
      );
      setFeatured(tempFeatured);
    }
  }, []);

  useEffect(() => {
    if (newConfig) {
      console.log("New config.");
      setCurrentConfigIndex(configs.length - 1);
      setCurrentConfig(configs[configs.length - 1]);
      setName(configs[configs.length - 1].name);
      setDescription(configs[configs.length - 1].description);
      setNewConfig(false);
    }
  }, [configs]);

  useEffect(() => {
    if (currentConfig) {
      setSlotArrLength();
    }
  }, [currentConfig]);

  function setSlotArrLength() {
    const tempStarts = new Array<Dayjs>(
      configs[currentConfigIndex].slots.length,
    );
    setStartTimes(tempStarts);
    const tempEnds = new Array<Dayjs>(configs[currentConfigIndex].slots.length);
    setEndTimes(tempEnds);
    const tempTypes = new Array<VideoType>(
      configs[currentConfigIndex].slots.length,
    );
    setSlotTypes(tempTypes);
    const tempFeatured = new Array<boolean>(
      configs[currentConfigIndex].slots.length,
    );
    setFeatured(tempFeatured);
  }

  function handleChangeCurrentConfig(e: SelectChangeEvent) {
    const index = Number.parseInt(e.target.value);
    setCurrentConfigIndex(index);

    setName(configs[index].name);
    setDescription(configs[index].description);

    setCurrentConfig(configs[index]);

    setSlotArrLength();
  }

  function handleSaveConfig() {
    const tempConfigs = configs.slice();
    for (let i = 0; i < tempConfigs[currentConfigIndex].slots.length; i++) {
      // Start time
      if (startTimes[i] !== undefined) {
        tempConfigs[currentConfigIndex].slots[i].startTime =
          startTimes[i].get("minutes") + startTimes[i].get("hours") * 60;
      }
      // End time
      if (endTimes[i] !== undefined) {
        tempConfigs[currentConfigIndex].slots[i].endTime =
          endTimes[i].get("minutes") + endTimes[i].get("hours") * 60;
      }
      // Type
      if (slotTypes[i] !== undefined) {
        tempConfigs[currentConfigIndex].slots[i].type = slotTypes[i];
      }
      // Featured
      if (featured[i] !== undefined) {
        tempConfigs[currentConfigIndex].slots[i].featured = featured[i];
      }
    }

    tempConfigs[currentConfigIndex].name = name;
    tempConfigs[currentConfigIndex].description = description;
    setConfigs(tempConfigs);
    setCurrentConfig(tempConfigs[currentConfigIndex]);
    writeData("configs.conf", tempConfigs);
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleCreateConfig() {
    const tempConfig = new PlaylistConfig();
    tempConfig.generateUUID();
    tempConfig.name = "New Playlist";
    tempConfig.description = "...";
    tempConfig.slots = new Array();
    const tempSlot = new PlaylistConfigSlot();
    tempSlot.generateUUID();
    tempSlot.endTime = 1439;
    tempSlot.startTime = 0;
    tempSlot.muted = false;
    tempSlot.volume = 100;
    tempSlot.type = types[1];
    tempSlot.featured = false;
    tempConfig.slots.push(tempSlot);

    const tempConfigs = configs.slice();
    tempConfigs.push(tempConfig);
    setConfigs(tempConfigs);

    setNewConfig(true);
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
              <Stack spacing={1} direction="row">
                <FormControl fullWidth>
                  <InputLabel id="current-config-select-label">
                    Current Configuration
                  </InputLabel>
                  <Select
                    labelId="current-config-select-label"
                    id="current-config-select"
                    value={currentConfigIndex.toLocaleString()}
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
                <Button
                  variant="outlined"
                  color="success"
                  onClick={handleCreateConfig}
                >
                  Create Config
                </Button>
              </Stack>

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
                    value={name !== undefined ? name : currentConfig.name}
                    onChange={handleChangeName}
                    error={name === ""}
                    helperText={name === "" ? "Name must not be empty" : ""}
                  />
                  <TextField
                    id="config-description"
                    label="Description"
                    variant="outlined"
                    value={
                      description !== undefined
                        ? description
                        : currentConfig.description
                    }
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
                      currentConfig={currentConfig}
                      featured={featured}
                      setFeatured={setFeatured}
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
          <Stack>
            <FillerContentType />
            <FilesConfig />
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
