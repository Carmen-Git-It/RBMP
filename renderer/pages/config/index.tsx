import { Typography, Grid, Stack, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, List, ListItem, ListItemText, Paper, Button, TextField, Card, CardContent, CardHeader } from "@mui/material"
import { useAtom } from "jotai"
import React, { useEffect, useState } from "react"
import { currentPlaylistConfigIdAtom, filesAtom, playlistConfigAtom, typesAtom } from "../../store/store"

export default function Config() {
    const [configs, setConfigs] = useAtom(playlistConfigAtom);
    const [currentConfig, setCurrentConfig] = useAtom(currentPlaylistConfigIdAtom);
    const [files, setFiles] = useAtom(filesAtom);
    const [types, setTypes] = useAtom(typesAtom);

    const [startMinutes, setStartMinutes] = useState(new Array(100));
    const [startHours, setStartHours] = useState(new Array(100));
    const [endMinutes, setEndMinutes] = useState(new Array(100));
    const [endHours, setEndHours] = useState(new Array(100));
    const [name, setName] = useState(configs[currentConfig].name);
    const [description, setDescription] = useState(configs[currentConfig].description);

    const [hasWindow, setHasWindow] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setHasWindow(true);
        }
    }, []);

    const minutesArr = Array.from({length: 60}, (x, i) => i);
    const hoursArr = Array.from({length: 24}, (x, i) => i);

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

    function handleSaveConfig() {
        var tempConfigs = configs.slice();
        for (var i = 0; i < tempConfigs[currentConfig].slots.length; i++) {
            // Start time
            console.log(startMinutes[i] + ": " + startHours[i]);
            if (startMinutes[i] !== undefined && startHours[i] !== undefined) {
                console.log('A');
                tempConfigs[currentConfig].slots[i].startTime = startMinutes[i] + startHours[i] * 60; // TODO: Deal with unchanged values
                console.log(tempConfigs[currentConfig].slots[i].startTime);
            }
            else if (startMinutes[i] !== undefined) {
                console.log('B');
                tempConfigs[currentConfig].slots[i].startTime = tempConfigs[currentConfig].slots[i].startTime % 60 + startMinutes[i];
            }
            else if (startHours[i] !== undefined) {
                console.log('C');
                tempConfigs[currentConfig].slots[i].startTime = Math.floor(tempConfigs[currentConfig].slots[i].startTime / 60) + startHours[i] * 60
            }
            console.log('D');
            // End time
            if (endMinutes[i] !== undefined && endHours[i] !== undefined) {
                console.log('E');
                tempConfigs[currentConfig].slots[i].endTime = endMinutes[i] + endHours[i] * 60; // TODO: Deal with unchanged values
            }
            else if (endMinutes[i] !== undefined) {
                console.log('F');
                tempConfigs[currentConfig].slots[i].endTime = tempConfigs[currentConfig].slots[i].endTime % 60 + endMinutes[i];
            }
            else if (endHours[i] !== undefined) {
                console.log('G');
                tempConfigs[currentConfig].slots[i].endTime = Math.floor(tempConfigs[currentConfig].slots[i].endTime / 60) + endHours[i] * 60
            }
            
            // TODO: assign type, muted, volume
        }
        tempConfigs[currentConfig].name = name;
        tempConfigs[currentConfig].description = description;
        setConfigs(tempConfigs);
    }


    function handleChangeStartHour(e: SelectChangeEvent<Number>) {
        var index = Number.parseInt(e.target.name);
        var tempHours = startHours.slice();
        tempHours[index] = e.target.value;                 
        setStartHours(tempHours);
    }

    function handleChangeStartMinute(e: SelectChangeEvent<Number>) {
        var index = Number.parseInt(e.target.name);
        var tempMinutes = startMinutes.slice();                 
        tempMinutes[index] = e.target.value;
        setStartMinutes(tempMinutes);
    }

    function handleChangeEndHour(e: SelectChangeEvent<Number>) {
        var index = Number.parseInt(e.target.name);
        var tempHours = endHours.slice();
        tempHours[index] = e.target.value;                     
        setEndHours(tempHours);
    }

    function handleChangeEndMinute(e: SelectChangeEvent<Number>) {
        var index = Number.parseInt(e.target.name);
        var tempMinutes = endMinutes.slice();          
        tempMinutes[index] = e.target.value;
        setEndMinutes(tempMinutes);
    }


    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }
    
    // TODO: Do the same as above but for slot type

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
            <Grid container spacing={2} sx={{paddingBottom: 1}}>
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
                            <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 3, maxHeight: 400, paddingTop: 1, paddingRight: 2, overflow: 'auto'}}>
                                <Stack
                                    spacing={2}>
                                    <TextField id="config-name" label="Name" variant="outlined" defaultValue={configs[currentConfig].name} onChange={handleChangeName}/>
                                    <TextField id="config-description" label="Description" variant="outlined" defaultValue={configs[currentConfig].description} multiline onChange={handleChangeDescription}/>
                                    <Paper elevation={6}>
                                        {configs[currentConfig].slots.map((value, key) => 
                                            <Card variant="outlined" key={key + 1200} sx={{marginTop: 1}}>
                                                <CardHeader title={"Slot " + key}/>
                                                <CardContent>
                                                    <FormControl fullWidth>
                                                        <InputLabel id={"slot-type-select-label" + key}>Media Type</InputLabel>
                                                        <Select
                                                            labelId={"slot-type-select-label" + key}
                                                            id={"slot-type-select" + key}
                                                            defaultValue={value.type.id}
                                                            label="Media Type">
                                                                {types.map((type) => <MenuItem key={type.id + 800} value={type.id}>{type.name}</MenuItem>) }
                                                        </Select>
                                                    </FormControl>
                                                    <Typography>Start Time</Typography>
                                                    <Stack direction="row" spacing={2} sx={{paddingTop: 1}}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id={"slot-hour-select-label" + key}>Hour</InputLabel>
                                                            <Select
                                                                labelId={"slot-hour-select-label" + key}
                                                                id={"slot-hour-select" + key}
                                                                name={key + ""}
                                                                defaultValue={Math.floor(value.startTime / 60)}
                                                                onChange={handleChangeStartHour}
                                                                label="Hour">
                                                                    {hoursArr.map((val) => <MenuItem key={val + 1300} value={val}>{val}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                        <FormControl fullWidth >
                                                            <InputLabel id={"slot-minute-select-label" + key}>Minute</InputLabel>
                                                            <Select
                                                                labelId={"slot-minute-select-label" + key}
                                                                id={"slot-minute-select" + key}
                                                                name={key + ""}
                                                                defaultValue={value.startTime % 60}
                                                                onChange={handleChangeStartMinute}
                                                                label="Minute">
                                                                    {minutesArr.map((val) => <MenuItem key={val + 1400} value={val}>{val}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                    </Stack>
                                                    <Typography>End Time</Typography>
                                                    <Stack direction="row" spacing={2} sx={{paddingTop: 1}}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id={"slot-end-hour-select-label" + key}>Hour</InputLabel>
                                                            <Select
                                                                labelId={"slot-end-hour-select-label" + key}
                                                                id={"slot-end-hour-select" + key}
                                                                name={key + ""}
                                                                defaultValue={Math.floor(value.endTime / 60)}
                                                                onChange={handleChangeEndHour}
                                                                label="Hour">
                                                                    {hoursArr.map((val) => <MenuItem key={val + 1300} value={val}>{val}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                        <FormControl fullWidth >
                                                            <InputLabel id={"slot-end-minute-select-label" + key}>Minute</InputLabel>
                                                            <Select
                                                                labelId={"slot-end-minute-select-label" + key}
                                                                id={"slot-end-minute-select" + key}
                                                                name={key + ""}
                                                                defaultValue={value.endTime % 60}
                                                                onChange={handleChangeEndMinute}
                                                                label="Minute">
                                                                    {minutesArr.map((val) => <MenuItem key={val + 1400} value={val}>{val}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Paper>
                                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        {configs[currentConfig].slots.map((value, key) => 
                                            <ListItem
                                            key={(key + 1) * 25}
                                            >
                                                <ListItemText primary={JSON.stringify(value)} />
                                            </ListItem>
                                        )}
                                    </List>
                                    <Button onClick={handleSaveConfig} variant="outlined" color="success" sx={{width:"100%"}}>Save</Button>
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