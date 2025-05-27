import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect } from "react";
import { fillerAtom, typesAtom } from "../store/store";

export default function FillerContentType() {
  const types = useAtomValue(typesAtom);
  const [currentType, setCurrentType] = useAtom(fillerAtom);

  useEffect(() => {
    if (!currentType) {
      setCurrentType(types[1]);
    }
  }, []);

  function handleChangeType(e: SelectChangeEvent) {
    console.log(e.target.value);
    console.log(types[1].id);
    setCurrentType(
      types.filter((t) => t.id.localeCompare(e.target.value) === 0)[0],
    );
  }

  return (
    <React.Fragment>
      {currentType && types.length > 0 && (
        <Box>
          <Typography variant="h5">Filler Content Type</Typography>
          <FormControl fullWidth>
            <InputLabel id={"filler-type-select-label"}>Media Type</InputLabel>
            <Select
              labelId={"filler-type-select-label"}
              value={currentType.id}
              onChange={handleChangeType}
              label="Media Type"
            >
              {types.slice(1).map((type, typeKey) => (
                <MenuItem key={typeKey} value={type.id as any}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </React.Fragment>
  );
}
