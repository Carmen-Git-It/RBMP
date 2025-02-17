import { Typography, Grid, Stack, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, List, ListItem, ListItemText, Paper, Button } from "@mui/material"
import { useAtom } from "jotai"
import React, { useEffect, useState } from "react"
import { currentPlaylistConfigIdAtom, filesAtom, playlistConfigAtom } from "../../store/store"

export default function Config() {
    const [configs, setConfigs] = useAtom(playlistConfigAtom);
    const [currentConfig, setCurrentConfig] = useAtom(currentPlaylistConfigIdAtom);

    const [files, setFiles] = useAtom(filesAtom);

    // const [hasWindow, setHasWindow] = useState(false);
    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         setHasWindow(true);
    //     }
    // }, []);

    function handleChangeCurrentConfig(e: SelectChangeEvent) {
        setCurrentConfig(Number.parseInt(e.target.value));
    }
    
    function handleAddFile() {
        // TODO: Handle add file
    }

    function handleAddFolder() {
        // TODO: Handle add folder, prompt for tag or use folder name as tag
    }

    function handleAddArchive() {
        // TODO: Add folder and all subfolders, use folder names as tags
    }

    useEffect(() => {

    }, [configs, currentConfig]);

    files.map((value, key) => {
        <ListItem key={(key + 20) * 5}>
            <ListItemText primary={value.fileName}/>
        </ListItem>
    });

    return (
        <React.Fragment>
            <Typography variant="h1" gutterBottom>Config</Typography>
            <Grid container spacing={2}>
                <Grid item md={6}>
                    <Paper elevation={3} sx={{padding: 2}}>
                        <Stack
                            spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel id="current-config-select-label">Current Configuration</InputLabel>
                                <Select
                                    labelId="current-config-select-label"
                                    id="current-config-select"
                                    value={currentConfig.toLocaleString()}
                                    label="Current Configuration"
                                    onChange={handleChangeCurrentConfig}>
                                        {configs.map((config) => <MenuItem key={config.id} value={config.id}>{config.name}</MenuItem>) }
                                    </Select>
                            </FormControl>
                            <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 3, maxHeight: 400, overflow: 'auto'}}>
                                <Stack
                                    spacing={2}>
                                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        {Object.values(configs[currentConfig]).map((value, key) => 
                                            <ListItem
                                            key={(key + 2) * 50}
                                            >
                                                <ListItemText primary={Object.keys(configs[currentConfig])[key] + ": " + value} />
                                            </ListItem>
                                        )}
                                    </List>
                                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        {configs[currentConfig].slots.map((value, key) => 
                                            <ListItem
                                            key={(key + 1) * 25}
                                            >
                                                <ListItemText primary={JSON.stringify(value)} />
                                            </ListItem>
                                        )}
                                    </List>
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                    
                </Grid>
                <Grid item md={6}>
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

                </Grid>
            </Grid>
            
        </React.Fragment>
    )
}