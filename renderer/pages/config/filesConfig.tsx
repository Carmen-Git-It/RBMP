import { Button, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { filesAtom } from "../../store/store";
import AddFolder from "./addFolder";


export default function FilesConfig() {
    const [files, setFiles] = useAtom(filesAtom);

    useEffect(() => {

    }, [files])
        
    function handleAddFile() {
        // TODO: Handle add file
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
                <AddFolder/>
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