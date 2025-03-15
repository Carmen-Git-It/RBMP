import {
  Button,
  Card,
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import VideoFile from "../lib/model/videoFile";
import { useAtom } from "jotai";
import { filesAtom } from "../store/store";
import writeData from "../lib/writeData";

export default function FileList({ files }) {
  const [allFiles, setAllFiles] = useAtom(filesAtom);

  function handleFileClick(id: String) {
    // Open edit file modal
    return id;
  }

  function handleDeleteFile(id: String) {
    const tempFiles = allFiles.slice();
    let index = 0;
    for (let i = 0; i < tempFiles.length; i++) {
      if (tempFiles[i].id.localeCompare(id.toString()) === 0) {
        index = i;
        break;
      }
    }
    tempFiles.splice(index, 1);
    writeData("files.conf", tempFiles);
    setAllFiles(tempFiles);
  }

  return (
    <List sx={{ width: "100%" }}>
      {files.map((value: VideoFile, key: number) => (
        <ListItem key={key}>
          <Card
            variant="outlined"
            sx={{ width: "100%", marginTop: -1, marginBottom: -1 }}
            elevation={0}
          >
            <Stack direction="row" alignItems={"center"}>
              <CardActionArea
                onClick={() => handleFileClick(value.id)}
                sx={{
                  height: "100%",
                  "&:hover": { backgroundColor: "action.selectedHover" },
                  paddingTop: 1,
                  paddingBottom: 1,
                  paddingLeft: 2,
                }}
              >
                <ListItemText
                  primary={value.fileName}
                  secondary={value.type.name}
                />
              </CardActionArea>
              <Button
                color="error"
                sx={{ height: "100%", paddingTop: 1, paddingBottom: 1 }}
                onClick={() => handleDeleteFile(value.id)}
              >
                X
              </Button>
            </Stack>
          </Card>
        </ListItem>
      ))}
    </List>
  );
}
