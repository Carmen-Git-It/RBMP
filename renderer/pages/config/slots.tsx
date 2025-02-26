import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import VideoType from "../../lib/model/videoType";
import PlaylistConfigSlot from "../../lib/model/playlistConfigSlot";
import {
  currentPlaylistConfigIdAtom,
  playlistConfigAtom,
  typesAtom,
} from "../../store/store";
import writeData from "../../lib/writeData";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

export default function Slots({
  startTimes,
  setStartTimes,
  endTimes,
  setEndTimes,
  slotTypes,
  setSlotTypes,
}) {
  const [types, setTypes] = useAtom(typesAtom);
  const [configs, setConfigs] = useAtom(playlistConfigAtom);
  const currentConfig = useAtomValue(currentPlaylistConfigIdAtom);

  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeSlot, setNewTypeSlot] = useState(0);
  const [currentSlots, setCurrentSlots] = useState(
    configs[currentConfig].slots.slice(),
  );

  function handleOpenTypeModal(index) {
    setNewTypeSlot(index);
    setTypeModalOpen(true);
  }

  function handleCloseTypeModal() {
    setTypeModalOpen(false);
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

  function handleChangeStartTime(val: Dayjs, index: number) {
    const tempStarts = startTimes;
    tempStarts[index] = val;
    setStartTimes(tempStarts);
  }

  function handleChangeEndTime(val: Dayjs, index: number) {
    const tempEnds = endTimes;
    tempEnds[index] = val;
    setEndTimes(tempEnds);
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

    const tempStarts = startTimes;
    tempStarts.unshift(undefined);
    setStartTimes(tempStarts);

    const tempEnds = endTimes;
    tempEnds.unshift(undefined);
    setEndTimes(tempEnds);

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

    const tempStarts = startTimes;
    tempStarts.splice(index, 1);
    setStartTimes(tempStarts);

    const tempEnds = endTimes;
    tempEnds.splice(index, 1);
    setEndTimes(tempEnds);

    const tempSlotTypes = slotTypes;
    tempSlotTypes.splice(index, 1);
    setSlotTypes(tempSlotTypes);

    setConfigs(tempConfigs.slice());
    setCurrentSlots(tempConfigs[currentConfig].slots.slice());
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

  return (
    <React.Fragment>
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
                  <MenuItem key={typeKey + 4000} value={type.id as any}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography>Start Time</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                value={
                  startTimes[key] !== undefined
                    ? startTimes[key]
                    : dayjs(
                        "2022-04-17T" +
                          Math.floor(value.startTime / 60) +
                          ":" +
                          (value.startTime % 60),
                      )
                }
                onChange={(val) => handleChangeStartTime(val, key)}
              />
            </LocalizationProvider>

            <Typography>End Time</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                value={
                  endTimes[key] !== undefined
                    ? endTimes[key]
                    : dayjs(
                        "2022-04-17T" +
                          Math.floor(value.endTime / 60) +
                          ":" +
                          (value.endTime % 60),
                      )
                }
                onChange={(val) => handleChangeEndTime(val, key)}
              />
            </LocalizationProvider>
          </CardContent>
        </Card>
      ))}
    </React.Fragment>
  );
}
