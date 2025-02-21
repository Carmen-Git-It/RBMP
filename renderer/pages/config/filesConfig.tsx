import { Button, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";
import { filesAtom } from "../../store/store";


export default function FilesConfig() {
    const [files, setFiles] = useAtom(filesAtom);
        
    function handleAddFile() {
        // TODO: Handle add file
    }

    function handleAddFolder() {
        // TODO: Handle add folder, prompt for tag or use folder name as tag

        // Receive list of all filenames in the folder, along with the folder name
        // Store just the folder name for later scanning
        // Add file scan button
    }

    function handleAddArchive() {
        // TODO: Add folder and all subfolders, use folder names as tags
    }

    // TODO: Add file edit modal? Add sorting for files and folders
    // OR: Only allow changing the type of the file, add new type, etc.

    return (
        <React.Fragment>
            <Paper elevation={3} sx={{padding: 2}}>
                <Button variant="contained" onClick={handleAddFile} sx={{marginRight: 2}}>Add File</Button>
                <Button variant="contained" onClick={handleAddFolder} sx={{marginRight: 2}}>Add Folder</Button>
                <Button variant="contained" onClick={handleAddArchive}>Add Archive</Button>
                <Stack
                spacing={2}>
                    <Typography variant="h5">
                        Files
                    </Typography>
                    <Paper elevation={2} sx={{maxHeight: 400, overflow: 'auto'}}>
                        <List sx={{ width: '100%',}}>
                            {files.map((value, key) => 
                                <ListItem
                                key={(key + 10) * 75}
                                >
                                    <ListItemText primary={value.fileName} />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Stack>
            </Paper>
        </React.Fragment>
    )
}