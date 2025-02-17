import { Typography, Grid, Stack, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { useAtom } from "jotai"
import React from "react"
import { currentPlaylistConfigIdAtom, playlistConfigAtom } from "../../store/store"

export default function Config() {
    const [configs, setConfigs] = useAtom(playlistConfigAtom);
    const [currentConfig, setCurrentConfig] = useAtom(currentPlaylistConfigIdAtom);

    function handleChangeCurrentConfig(e: SelectChangeEvent) {
        setCurrentConfig(Number.parseInt(e.target.value));
    }

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
                            {configs.map((config) => <MenuItem value={config.id}>{config.name}</MenuItem>) }
                        </Select>
                </FormControl>


            </Stack>
        </React.Fragment>
    )
}