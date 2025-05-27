import {
  Box,
  Button,
  Card,
  CardActionArea,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import { filesAtom } from "../store/store";
import AddFolder from "./addFolder";
import AddFile from "./addFile";
import Folder from "../lib/model/folder";
import FileList from "./fileList";

export default function FilesConfig() {
  const files = useAtomValue(filesAtom);
  const [folders, setFolders] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    if (folders.length !== expanded.length) {
      const tempArr = new Array(folders.length);
      tempArr.fill(false);
      setExpanded(tempArr);
    }
  }, [folders]);

  // This is slow as fuck, make this a static part of the model calculated once, better more RAM than more slowdown
  useEffect(() => {
    if (files) {
      const tempFolders = new Array();
      for (const file of files) {
        let folder = new Folder();
        let name = "";
        if (file.filePath.includes("/")) {
          const index = file.filePath.split("/").length - 2;
          name = file.filePath.split("/")[index];
        } else {
          const index = file.filePath.split("\\").length - 2;
          name = file.filePath.split("\\")[index];
        }
        const matchingFolder = tempFolders.filter(
          (f) => f.name.localeCompare(name) === 0,
        );

        if (matchingFolder.length === 0) {
          folder.name = name;
          folder.files.push(file);
          tempFolders.push(folder);
        } else {
          folder = matchingFolder[0];
          folder.files.push(file);
        }
      }
      setFolders(tempFolders);
    }
  }, [files]);

  function handleAddArchive() {
    // TODO: Add folder and all subfolders, use folder names as tags
  }

  // TODO: Add file edit modal? Add sorting for files and folders
  // OR: Only allow changing the type of the file, add new type, etc.

  // Folder -> Files
  // Generate folders programmatically here? Too heavy?
  // Add folder as a piece of data to the file object?
  // Either way expandable folders with files inside

  function handleFolderClick(index: number) {
    // Edit folder type?
    return index;
  }

  function handleFolderShow(index: number) {
    const temp = expanded.slice();
    temp[index] = !temp[index];
    setExpanded(temp);
  }

  return (
    <React.Fragment>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <AddFile />
        <AddFolder />
        <Button variant="contained" onClick={handleAddArchive}>
          Add Archive
        </Button>
        <Stack spacing={2}>
          <Typography variant="h5">Files</Typography>
          <Paper elevation={2} sx={{}}>
            <List sx={{ width: "100%" }}>
              {folders &&
                folders.map((folder, key) => (
                  <Box sx={{ border: "Highlight" }} key={key}>
                    <ListItem>
                      <Card
                        variant="outlined"
                        sx={{
                          width: "100%",
                          paddingRight: 2,
                          paddingTop: 1,
                          paddingBottom: 1,
                        }}
                        elevation={0}
                      >
                        <Stack direction="row" alignItems={"center"}>
                          <CardActionArea
                            onClick={() => handleFolderClick(key)}
                            sx={{
                              height: "100%",
                              "&:hover": {
                                backgroundColor: "action.selectedHover",
                              },
                              paddingTop: 1,
                              paddingBottom: 1,
                              paddingLeft: 2,
                            }}
                          >
                            <ListItemText primary={folder.name} />
                          </CardActionArea>
                          <Button
                            color="primary"
                            variant="outlined"
                            sx={{
                              height: "100%",
                              paddingTop: 1,
                              paddingBottom: 1,
                            }}
                            onClick={() => handleFolderShow(key)}
                          >
                            {expanded[key] ? "Hide" : "Show"}
                          </Button>
                        </Stack>
                      </Card>
                    </ListItem>
                    {expanded[key] && <FileList files={folder.files} />}
                    <Divider />
                  </Box>
                ))}
            </List>
          </Paper>
        </Stack>
      </Paper>
    </React.Fragment>
  );
}
