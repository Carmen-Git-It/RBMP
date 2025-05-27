import {
  Box,
  Button,
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
import React, { useEffect, useState } from "react";
import selectMediaFile from "../lib/selectMediaFile";
import { useAtom } from "jotai";
import VideoType from "../lib/model/videoType";
import writeData from "../lib/writeData";
import VideoFile from "../lib/model/videoFile";
import { filesAtom, typesAtom } from "../store/store";

export default function AddFile() {
  const [types, setTypes] = useAtom(typesAtom);
  const [files, setFiles] = useAtom(filesAtom);

  const [modalOpen, setModalOpen] = useState(false);
  const [fileData, setFileData] = useState();
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState(types[1]);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("TypeName");

  useEffect(() => {
    if (fileData) {
      setModalOpen(true);
    }
  }, [fileData]);

  function handleAddFile() {
    selectMediaFile().then((data) => {
      if (data) {
        if (data.filePath.includes("/")) {
          setFileName(
            data.filePath.split("/")[data.filePath.split("/").length - 1],
          );
        } else if (data.filePath.includes("\\")) {
          setFileName(
            (data["fileName"] =
              data.filePath.split("\\")[data.filePath.split("\\").length - 1]),
          );
        }
        setFileData(data);
      }
    });
  }

  // Add File Modal
  function handleCloseModal() {
    setModalOpen(false);
  }

  function handleModalCancel() {
    setModalOpen(false);
  }

  function handleModalSave() {
    const f = new VideoFile();
    f.generateUUID();
    if (fileData) {
      // @ts-ignore: Object is possibly 'null'
      f.duration = fileData.duration;
      f.fileName = fileName;
      // @ts-ignore: Object is possibly 'null'
      f.filePath = fileData.filePath;
    }
    f.muted = false;
    f.type = fileType;

    setFiles([...files, f]);
    writeData("files.conf", [...files, f]);
    setModalOpen(false);
  }

  function handleFileNameChange(e) {
    setFileName(e.target.value);
  }

  function handleChangeType(e: SelectChangeEvent) {
    if (e.target.value === types[0].id) {
      setTypeModalOpen(true);
    } else {
      setFileType(types.filter((t) => t.id === e.target.value)[0]);
    }
  }

  // Type Modal
  function handleChangeTypeName(e) {
    setNewTypeName(e.target.value);
  }

  function handleCloseTypeModal() {
    setTypeModalOpen(false);
  }

  function handleTypeModalCancel() {
    setTypeModalOpen(false);
  }

  function handleTypeModalSave() {
    const tempType: VideoType = new VideoType();
    tempType.generateUUID();
    tempType.name = newTypeName;

    const tempTypes: VideoType[] = types.slice();
    tempTypes.push(tempType);
    setTypes(tempTypes);
    writeData("types.conf", tempTypes);

    setFileType(tempType);
    setTypeModalOpen(false);
  }

  return (
    <React.Fragment>
      <Modal
        disableEscapeKeyDown
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
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
          <Stack spacing={2}>
            <Typography id="modal-title" variant="h6" component="h2">
              Add Media File
            </Typography>
            <TextField
              label="File Name"
              error={fileName === ""}
              onChange={handleFileNameChange}
              defaultValue={fileName}
            />
            {fileData && (
              <Typography variant="body1">
                {
                  // @ts-ignore: Object is possibly 'null'
                  "Duration: " + fileData.duration + "s"
                }
              </Typography>
            )}
            <FormControl fullWidth>
              <InputLabel id={"type-select-label"}>Media Type</InputLabel>
              <Select
                labelId={"type-select-label"}
                id={"type-select"}
                defaultValue={fileType.id}
                value={fileType.id}
                onChange={handleChangeType}
                label="Media Type"
              >
                {types.map((type: VideoType, key) => (
                  <MenuItem key={key} value={type.id as any}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                Save File
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
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
            defaultValue={newTypeName}
            onChange={handleChangeTypeName}
            error={newTypeName === ""}
            sx={{ paddingTop: 2 }}
          />
          <Stack spacing={2} direction="row" sx={{ paddingTop: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleTypeModalCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleTypeModalSave}
            >
              Save Type
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleAddFile}
        sx={{ marginRight: 2 }}
      >
        Add File
      </Button>
    </React.Fragment>
  );
}
