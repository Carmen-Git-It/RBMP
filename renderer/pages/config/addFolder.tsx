import { Box, Button, FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, Modal, Paper, Select, SelectChangeEvent, Snackbar, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import selectMediaDir from "../../lib/selectMediaDir";
import { useAtom } from "jotai";
import { filesAtom, typesAtom } from "../../store/store";
import VideoType from "../../lib/model/videoType";
import writeData from "../../lib/writeData";
import VideoFile from "../../lib/model/videoFile";

export default function AddFolder() {
    const [types, setTypes] = useAtom<Array<VideoType>>(typesAtom);
    const [files, setFiles] = useAtom(filesAtom);

    const [modalOpen, setModalOpen] = useState(false);
    // data of format {path1: [filePaths...], path2: [filepaths...] ...}
    const [folderData, setFolderData] = useState<any>();
    const [folderType, setFolderType] = useState<VideoType>(types[1]);

    const [listExpanded, setListExpanded] = useState(new Array<boolean>(100));

    const [typeModalOpen, setTypeModalOpen] = useState(false);
    const [newTypeName, setNewTypeName] = useState("TypeName");

    useEffect(() => {
        if (folderData) {
            setModalOpen(true);
        }
    }, [folderData]);

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
        var tempType : VideoType = new VideoType();
        tempType.generateUUID();
        tempType.name = newTypeName;

        var tempTypes : Array<VideoType> = types.slice();
        tempTypes.push(tempType);
        setTypes(tempTypes);
        writeData("types.conf", tempTypes);

        setFolderType(tempType);
        setTypeModalOpen(false);
    }

    // Folder modal
    function handleModalCancel() {
        setListExpanded(new Array(100));
        setModalOpen(false);
    }

    function handleModalSave() {
        const tempFiles = files.slice();
        for (const dir of Object.keys(folderData)) {
            for (const file of folderData[dir]) {
                const tempFile = new VideoFile();
                tempFile.generateUUID();
                tempFile.fileName = file.filePath;
                tempFile.filePath = dir + "\\" + file.filePath;
                tempFile.duration = file.duration;
                tempFile.muted = false;
                tempFile.type = folderType;

                tempFiles.push(tempFile);
            }
        }
        setFiles(tempFiles);
        setListExpanded(new Array(100));
        writeData("files.conf", tempFiles);
        setModalOpen(false);
    }

    function handleModalClose() {
        setListExpanded(new Array(100));
    }

    function handleAddFolder() {
        selectMediaDir().then((data) => {
            if (data == null || Object.keys(data).length === 0) {
                setModalOpen(false);
                return;
            }
            setFolderData(data);

            Object.keys(data).map((index, key) => {
                data[index].map((val, k) => {
                    console.log(val);
                })
            })

            setModalOpen(true);
        });
    
        // Receive list of all filenames in the folder, along with the folder name
        // Store just the folder name for later scanning
        // Add file scan button
    }

    function handleChangeType(e : SelectChangeEvent) {
        if (e.target.value === types[0].id) {
            setTypeModalOpen(true);
        } else {
            const t = types.filter((tmp) => tmp.id === e.target.value)[0];
            setFolderType(t);
        }
    }

    function changeListStatus(index) {
        console.log("Change List Status: " + index);
        var temp = listExpanded.slice();
        if (temp[index] == undefined || temp[index] == null) {
            console.log("Setting to false");
            temp[index] = false;
        } else {
            temp[index] = !temp[index];
        }
        setListExpanded(temp);
    }

    return (
        <React.Fragment>
            <Modal
                open={typeModalOpen}
                onClose={handleCloseTypeModal}
                aria-labelledby="type-modal-title"
                aria-describedby="type-modal-description">
                <Box sx={{position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 400, 
                    bgcolor: 'background.paper', 
                    border: '2px solid #000', 
                    boxShadow: 24, 
                    p: 4,}}>
                    <Typography id="type-modal-title" variant="h6" component="h2">Create New Type</Typography>
                    <TextField id="new-type-name" label="Name" variant="outlined" defaultValue="TypeName" onChange={handleChangeTypeName} error={newTypeName === ""} sx={{paddingTop: 2}}/>
                    <Stack spacing={2} direction="row" sx={{paddingTop: 2}}>
                        <Button variant="outlined" color="error" onClick={handleTypeModalCancel}>Cancel</Button>
                        <Button variant="contained" color="success" onClick={handleTypeModalSave}>Save Type</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal
            disableEscapeKeyDown
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="type-modal-title"
            aria-describedby="type-modal-description">
                <Box sx={{position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    width: 800,
                    height: 600,
                    transform: 'translate(-50%, -50%)',  
                    bgcolor: 'background.paper', 
                    border: '2px solid #000', 
                    boxShadow: 24, 
                    p: 4,
                    overflow:"auto"}}>
                    <Typography id="type-modal-title" variant="h6" component="h2" sx={{padding: 1}}>Import Folder(s)</Typography>
                    {!folderData ? 
                        <React.Fragment>
                            <Typography id="type-modal-description" variant="body1" color="red">Error! Could not load files.</Typography>
                            <Button variant="outlined" color="error">Exit</Button>
                        </React.Fragment> :
                        <React.Fragment>
                            <FormControl fullWidth>
                                <InputLabel id={"type-select-label"}>Media Type</InputLabel>
                                <Select
                                    labelId={"type-select-label"}
                                    id={"type-select"}
                                    defaultValue={folderType.id}
                                    value={folderType.id}
                                    onChange={handleChangeType}
                                    label="Media Type">
                                        {types.map((type : VideoType, key) => <MenuItem key={key} value={type.id as any}>{type.name}</MenuItem>) }
                                </Select>
                            </FormControl>
                        
                            {Object.keys(folderData).map((index, key) =>
                                <Paper key={key} elevation={3} sx={{marginTop: 1}}>
                                    <Typography variant="h6" sx={{paddingTop: 1, paddingLext: 1, textDecoration: "underline"}}>{index}</Typography>
                                    <Button onClick={() => {changeListStatus(key)}}>{(listExpanded[key] === undefined || listExpanded[key]) ? "Hide Files" : "Show Files"}</Button>
                                    <List sx={{paddingTop: 1, paddingBottom: 2}}>
                                        {(listExpanded[key] === undefined || listExpanded[key]) && folderData[index].map((file, fileKey : number) => 
                                                <ListItem key={fileKey + 20000}>
                                                    <ListItemText primary={file.filePath}/>
                                                    <ListItemText primary={"Duration: " + file.duration + "s"}></ListItemText>
                                                </ListItem>
                                            )}
                                    </List>
                                </Paper>
                            )}
                            

                            <Stack spacing={2} direction="row" sx={{paddingTop: 2}}>
                                <Button variant="outlined" color="error" onClick={handleModalCancel}>Cancel</Button>
                                <Button variant="contained" color="success" onClick={handleModalSave}>Save Files and Folders</Button>
                            </Stack>
                        </React.Fragment>
                    }
                </Box>
            </Modal>
            <Button variant="contained" onClick={handleAddFolder} sx={{marginRight: 2}}>Add Folder</Button>
        </React.Fragment>
    );
}