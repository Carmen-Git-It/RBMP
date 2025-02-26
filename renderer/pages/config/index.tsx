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
  Card,
  CardContent,
  CardHeader,
  Modal,
} from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  currentPlaylistConfigIdAtom,
  playlistConfigAtom,
  typesAtom,
} from "../../store/store";
import VideoType from "../../lib/model/videoType";
import writeData from "../../lib/writeData";
import FilesConfig from "./filesConfig";
import PlaylistConfigSlot from "../../lib/model/playlistConfigSlot";

// TODO: Refactor this monstrosity

export default function Config() {
  const [configs, setConfigs] = useAtom(playlistConfigAtom);

  console.log("CONFIG RENDERER + " + configs);
  const [currentConfig, setCurrentConfig] = useAtom(
    currentPlaylistConfigIdAtom,
  );
  const [types, setTypes] = useAtom(typesAtom);

  const [startMinutes, setStartMinutes] = useState(new Array(100));
  const [startHours, setStartHours] = useState(new Array(100)); // TODO: Add and remove array entries manually on config load and slot modification.
  const [endMinutes, setEndMinutes] = useState(new Array(100));
  const [endHours, setEndHours] = useState(new Array(100));
  const [slotTypes, setSlotTypes] = useState(new Array<VideoType>(100));
  const [name, setName] = useState(configs[currentConfig].name);
  const [description, setDescription] = useState(
    configs[currentConfig].description,
  );
  const [currentSlots, setCurrentSlots] = useState(
    configs[currentConfig].slots.slice(),
  );

  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeSlot, setNewTypeSlot] = useState(0);

  function handleOpenTypeModal(index) {
    setNewTypeSlot(index);
    setTypeModalOpen(true);
  }

  function handleCloseTypeModal() {
    setTypeModalOpen(false);
  }

  // Save new type and set slot type to new type
  function handleModalSave() {
    const tempType: VideoType = new VideoType();
    tempType.generateUUID();
    tempType.name = newTypeName;

    const tempTypes: VideoType[] = types.slice();
    tempTypes.push(tempType);
    setTypes(tempTypes);
    writeData("types.conf", tempTypes);

    configs[currentConfig].slots[newTypeSlot].type = types[types.length - 1];
    slotTypes[newTypeSlot] = tempType;

    setTypeModalOpen(false);
  }

  function handleModalCancel() {
    setTypeModalOpen(false);
  }

  function handleChangeTypeName(e) {
    setNewTypeName(e.target.value);
  }

  const minutesArr = Array.from({ length: 60 }, (x, i) => i);
  const hoursArr = Array.from({ length: 24 }, (x, i) => i);

  function handleChangeCurrentConfig(e: SelectChangeEvent) {
    setCurrentConfig(Number.parseInt(e.target.value));
  }

  function handleNewSlot() {
    console.log("Adding new slot");

    const tempSlot = new PlaylistConfigSlot();
    tempSlot.generateUUID();
    tempSlot.startTime = 0;
    tempSlot.endTime = 0;
    tempSlot.muted = false;
    tempSlot.type = types[1];

    const tempSlotTypes = slotTypes.slice();
    tempSlotTypes.unshift(undefined);
    setSlotTypes(tempSlotTypes);

    const tempStartMinutes = startMinutes;
    tempStartMinutes.unshift(undefined);
    setStartMinutes(tempStartMinutes);

    const tempStartHours = startHours;
    tempStartHours.unshift(undefined);
    setStartHours(tempStartHours);

    const tempEndMinutes = endMinutes;
    tempEndMinutes.unshift(undefined);
    setEndMinutes(tempEndMinutes);

    const tempEndHours = endHours;
    tempEndHours.unshift(undefined);
    setEndHours(tempEndHours);

    const tempConfigs = configs.slice();
    tempConfigs[currentConfig].slots.unshift(tempSlot);
    setConfigs(tempConfigs);

    const tempSlots = currentSlots.slice();
    tempSlots.unshift(tempSlot);
    setCurrentSlots(tempSlots);
  }

  function handleDeleteSlot(index: number) {
    console.log("Deleting slot: " + index);
    const tempConfigs = configs;
    tempConfigs[currentConfig].slots.splice(index, 1);

    const tempStartMinutes = startMinutes;
    tempStartMinutes.splice(index, 1);
    console.log(tempStartMinutes);
    tempStartMinutes.push(undefined);
    setStartMinutes(tempStartMinutes);

    const tempStartHours = startHours;
    tempStartHours.splice(index, 1);
    tempStartHours.push(undefined);
    setStartHours(tempStartHours);

    const tempEndMinutes = startMinutes;
    tempEndMinutes.splice(index, 1);
    console.log(tempEndMinutes);
    tempEndMinutes.push(undefined);
    setStartMinutes(tempEndMinutes);

    const tempEndHours = startHours;
    tempEndHours.splice(index, 1);
    tempEndHours.push(undefined);
    setStartHours(tempEndHours);

    const tempSlotTypes = slotTypes;
    tempSlotTypes.splice(index, 1);
    tempSlotTypes.push(undefined);
    setSlotTypes(tempSlotTypes);

    setConfigs(tempConfigs.slice());
    setCurrentSlots(tempConfigs[currentConfig].slots.slice());
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

  function handleChangeType(e: SelectChangeEvent) {
    if (e.target.value === types[0].id) {
      handleOpenTypeModal(Number.parseInt(e.target.name));
    } else {
      const index = Number.parseInt(e.target.name);
      const tempTypes: VideoType[] = slotTypes.slice();
      const temp = types.filter((t) => t.id === e.target.value)[0];
      tempTypes[index] = temp;
      setSlotTypes(tempTypes);
    }
  }

  function handleChangeStartHour(e: SelectChangeEvent<Number>) {
    const index = Number.parseInt(e.target.name);
    const tempHours = startHours.slice();
    tempHours[index] = e.target.value;
    setStartHours(tempHours);
  }

  function handleChangeStartMinute(e: SelectChangeEvent<Number>) {
    const index = Number.parseInt(e.target.name);
    const tempStartMinutes = startMinutes.slice();
    tempStartMinutes[index] = e.target.value;
    setStartMinutes(tempStartMinutes);
  }

  function handleChangeEndHour(e: SelectChangeEvent<Number>) {
    const index = Number.parseInt(e.target.name);
    const tempHours = endHours.slice();
    tempHours[index] = e.target.value;
    setEndHours(tempHours);
  }

  function handleChangeEndMinute(e: SelectChangeEvent<Number>) {
    const index = Number.parseInt(e.target.name);
    const tempStartMinutes = endMinutes.slice();
    tempStartMinutes[index] = e.target.value;
    setEndMinutes(tempStartMinutes);
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
      <Modal
        open={typeModalOpen}
        onClose={handleCloseTypeModal}
        aria-labelledby="type-modal-title"
        aria-describedby="type-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="type-modal-title" variant="h6" component="h2">
            Create New Type
          </Typography>
          <TextField
            id="new-type-name"
            label="Name"
            variant="outlined"
            defaultValue="TypeName"
            onChange={handleChangeTypeName}
            error={newTypeName === ""}
            sx={{ paddingTop: 2 }}
          />
          <Stack spacing={2} direction="row" sx={{ paddingTop: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleModalCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleModalSave}
            >
              Save Type
            </Button>
          </Stack>
        </Box>
      </Modal>
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
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={handleNewSlot}
                      sx={{ marginTop: 2 }}
                    >
                      New Slot
                    </Button>
                    {currentSlots.map((value, key) => (
                      <Card variant="outlined" key={key} sx={{ marginTop: 1 }}>
                        <CardHeader
                          title={"Slot " + key}
                          action={
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteSlot(key)}
                            >
                              Delete
                            </Button>
                          }
                        />
                        <CardContent>
                          <FormControl fullWidth>
                            <InputLabel id={"slot-type-select-label" + key}>
                              Media Type
                            </InputLabel>
                            <Select
                              labelId={"slot-type-select-label" + key}
                              id={"slot-type-select" + key}
                              defaultValue={value.type.id}
                              value={
                                slotTypes[key] !== undefined
                                  ? slotTypes[key].id
                                  : value.type.id
                              }
                              onChange={handleChangeType}
                              name={key + ""}
                              label="Media Type"
                            >
                              {types.map((type, typeKey) => (
                                <MenuItem
                                  key={typeKey + 4000}
                                  value={type.id as any}
                                >
                                  {type.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Typography>Start Time</Typography>
                          <Stack
                            direction="row"
                            spacing={2}
                            sx={{ paddingTop: 1 }}
                          >
                            <FormControl fullWidth>
                              <InputLabel id={"slot-hour-select-label" + key}>
                                Hour
                              </InputLabel>
                              <Select
                                labelId={"slot-hour-select-label" + key}
                                id={"slot-hour-select" + key}
                                name={key + ""}
                                defaultValue={Math.floor(value.startTime / 60)}
                                value={
                                  startHours[key] !== undefined
                                    ? startHours[key]
                                    : Math.floor(value.startTime / 60)
                                }
                                onChange={handleChangeStartHour}
                                label="Hour"
                              >
                                {hoursArr.map((val) => (
                                  <MenuItem key={val + 1300} value={val}>
                                    {val}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth>
                              <InputLabel id={"slot-minute-select-label" + key}>
                                Minute
                              </InputLabel>
                              <Select
                                labelId={"slot-minute-select-label" + key}
                                id={"slot-minute-select" + key}
                                name={key + ""}
                                defaultValue={value.startTime % 60}
                                value={
                                  startMinutes[key] !== undefined
                                    ? startMinutes[key]
                                    : Math.floor(value.startTime % 60)
                                }
                                onChange={handleChangeStartMinute}
                                label="Minute"
                              >
                                {minutesArr.map((val) => (
                                  <MenuItem key={val + 1400} value={val}>
                                    {val}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                          <Typography>End Time</Typography>
                          <Stack
                            direction="row"
                            spacing={2}
                            sx={{ paddingTop: 1 }}
                          >
                            <FormControl fullWidth>
                              <InputLabel
                                id={"slot-end-hour-select-label" + key}
                              >
                                Hour
                              </InputLabel>
                              <Select
                                labelId={"slot-end-hour-select-label" + key}
                                id={"slot-end-hour-select" + key}
                                name={key + ""}
                                defaultValue={Math.floor(value.endTime / 60)}
                                value={
                                  endHours[key] !== undefined
                                    ? endHours[key]
                                    : Math.floor(value.endTime / 60)
                                }
                                onChange={handleChangeEndHour}
                                label="Hour"
                              >
                                {hoursArr.map((val) => (
                                  <MenuItem key={val + 1300} value={val}>
                                    {val}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth>
                              <InputLabel
                                id={"slot-end-minute-select-label" + key}
                              >
                                Minute
                              </InputLabel>
                              <Select
                                labelId={"slot-end-minute-select-label" + key}
                                id={"slot-end-minute-select" + key}
                                name={key + ""}
                                defaultValue={value.endTime % 60}
                                value={
                                  endMinutes[key] !== undefined
                                    ? endMinutes[key]
                                    : Math.floor(value.endTime % 60)
                                }
                                onChange={handleChangeEndMinute}
                                label="Minute"
                              >
                                {minutesArr.map((val) => (
                                  <MenuItem key={val + 1400} value={val}>
                                    {val}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
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
