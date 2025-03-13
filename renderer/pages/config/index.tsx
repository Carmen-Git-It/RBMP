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
  fillerAtom,
  playlistConfigAtom,
  typesAtom,
} from "../../store/store";
import writeData from "../../lib/writeData";
import FilesConfig from "./filesConfig";
import Slots from "./slots";
import PlaylistConfig from "../../lib/model/playlistConfig";
import PlaylistConfigSlot from "../../lib/model/playlistConfigSlot";
import FillerContentType from "./fillerContentType";

// TODO: Fail gracefully when user lacks all basics
export default function Config() {
  const types = useAtomValue(typesAtom);
  const fillerType = useAtom(fillerAtom);
  const [configs, setConfigs] = useAtom(playlistConfigAtom);
  const [currentConfigIndex, setCurrentConfigIndex] = useAtom(
    currentPlaylistConfigIdAtom,
  );
  const [height, setHeight] = useState(0);
  const [currentConfig, setCurrentConfig] = useState(configs[currentConfigIndex]);
  const [currentSlots, setCurrentSlots] = useState(configs[currentConfigIndex].slots.slice());
  const [name, setName] = useState(configs[currentConfigIndex].name);
  const [newConfig, setNewConfig] = useState(false);
  const [description, setDescription] = useState(
    configs[currentConfigIndex].description,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("WINDOW HEIGHT: " + window.innerHeight);
      setHeight(window.innerHeight - 150);
      window.addEventListener("resize", () => {
        setHeight(window.innerHeight - 150);
      });
    }

    return () => {
      window.removeEventListener("resize", () => {
        setHeight(window.innerHeight - 150);
      });
    };
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
    writeData("config.conf", {currentConfigIndex: currentConfigIndex, fillerType: fillerType});
  }, [currentConfigIndex, fillerType])

  function handleChangeCurrentConfig(e: SelectChangeEvent) {
    const index = Number.parseInt(e.target.value);
    setCurrentConfigIndex(index);

    setName(configs[index].name);
    setDescription(configs[index].description);

    setCurrentConfig(configs[index]);
  }

  function handleSaveConfig() {
    const tempConfigs = configs.slice();
    currentConfig.slots = currentSlots;
    currentConfig.name = name;
    currentConfig.description = description;
    tempConfigs[currentConfigIndex] = currentConfig;
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
        <Grid item md={6} sx={{height: height}}>
          <Paper
            elevation={3}
            sx={{ padding: 2, overflow: "auto", maxHeight: "100%"}}
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
                      currentConfig={currentConfig}
                      currentSlots={currentSlots}
                      setCurrentSlots={setCurrentSlots}
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
        <Grid item md={6} sx={{height: height}}>
          <Stack sx={{maxHeight: "100%", overflow: "auto"}}>
            <FillerContentType />
            <FilesConfig />
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
