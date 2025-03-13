import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
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
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";

import VideoType from "../../lib/model/videoType";
import PlaylistConfigSlot from "../../lib/model/playlistConfigSlot";
import { typesAtom } from "../../store/store";
import writeData from "../../lib/writeData";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

export default function Slots({
  currentConfig,
  currentSlots,
  setCurrentSlots,
}) {
  const [types, setTypes] = useAtom(typesAtom);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeSlot, setNewTypeSlot] = useState(0);

  useEffect(() => {
    // Clone
    const tempSlots = currentConfig.slots.map((a: PlaylistConfigSlot) => {
      return { ...a };
    });
    tempSlots.sort(
      (a: PlaylistConfigSlot, b: PlaylistConfigSlot) =>
        a.startTime - b.startTime,
    );
    setCurrentSlots(tempSlots);
  }, [currentConfig]);

  function handleOpenTypeModal(index: number) {
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
      const tempSlots = currentSlots.slice();
      tempSlots[index].type = types.filter(
        (t) => t.id.localeCompare(e.target.value) === 0,
      )[0];
      setCurrentSlots(tempSlots);
    }
  }

  function handleChangeStartTime(val: Dayjs, index: number) {
    console.log("HANDLE CHANGE START TIME");
    const tempSlots = currentSlots.slice();
    tempSlots[index].startTime = val.get("hours") * 60 + val.get("minutes");
    tempSlots.sort((a, b) => a.startTime - b.startTime);
    setCurrentSlots(tempSlots);
  }

  function handleChangeEndTime(val: Dayjs, index: number) {
    const tempSlots = currentSlots.slice();
    tempSlots[index].endTime = val.get("hours") * 60 + val.get("minutes");
    setCurrentSlots(tempSlots);
  }

  function handleChangeFeatured(val: boolean, index: number) {
    const tempSlots = currentSlots.slice();
    tempSlots[index].featured = val;
    setCurrentSlots(tempSlots);
  }

  function handleNewSlot() {
    console.log("Adding new slot");

    const tempSlot = new PlaylistConfigSlot();
    tempSlot.generateUUID();
    tempSlot.startTime = 0;
    tempSlot.endTime = 0;
    tempSlot.muted = false;
    tempSlot.type = types[1];
    tempSlot.featured = false;

    const tempSlots = currentSlots.slice();
    tempSlots.unshift(tempSlot);
    setCurrentSlots(tempSlots);
  }

  function handleDeleteSlot(index: number) {
    console.log("Deleting slot: " + index);

    const tempSlots = currentSlots.slice();
    tempSlots.splice(index, 1);
    setCurrentSlots(tempSlots);
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

    const tempSlots = currentSlots.slice();
    tempSlots[newTypeSlot].type = tempType;
    setCurrentSlots(tempSlots);

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
      {currentSlots.map((value: PlaylistConfigSlot, key: number) => (
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
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel id={"slot-type-select-label" + key}>
                  Media Type
                </InputLabel>
                <Select
                  labelId={"slot-type-select-label" + key}
                  id={"slot-type-select" + key}
                  value={value.type.id}
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value.featured}
                    onChange={() => handleChangeFeatured(!value.featured, key)}
                  ></Checkbox>
                }
                label="Featured Content"
              ></FormControlLabel>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
              <Typography>Start Time</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={dayjs(
                    "2022-04-17T" +
                      Math.floor(value.startTime / 60) +
                      ":" +
                      (value.startTime % 60),
                  )}
                  onAccept={(val) => handleChangeStartTime(val, key)}
                />
              </LocalizationProvider>

              <Typography>End Time</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={dayjs(
                    "2022-04-17T" +
                      Math.floor(value.endTime / 60) +
                      ":" +
                      (value.endTime % 60),
                  )}
                  onAccept={(val) => handleChangeEndTime(val, key)}
                />
              </LocalizationProvider>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </React.Fragment>
  );
}
