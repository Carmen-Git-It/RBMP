import { Typography, Grid, Stack, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, List, ListItem, ListItemText } from "@mui/material"
import { useAtom } from "jotai"
import React, { useEffect } from "react"
import { currentPlaylistConfigIdAtom, playlistConfigAtom } from "../../store/store"

export default function Config() {
    const [configs, setConfigs] = useAtom(playlistConfigAtom);
    const [currentConfig, setCurrentConfig] = useAtom(currentPlaylistConfigIdAtom);

    function handleChangeCurrentConfig(e: SelectChangeEvent) {
        setCurrentConfig(Number.parseInt(e.target.value));
    }
    
    useEffect(() => {

    }, [configs, currentConfig]);

    return (
        <React.Fragment>
            <Typography variant="h1" gutterBottom>Config</Typography>
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
                <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 3}}>
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
                                key={(key + 1) * 50}
                                >
                                    <ListItemText primary={JSON.stringify(value)} />
                                </ListItem>
                            )}
                        </List>
                    </Stack>
                </Box>


            </Stack>
        </React.Fragment>
    )
}