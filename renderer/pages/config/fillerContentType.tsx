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
import React from "react";
import { fillerAtom, typesAtom } from "../../store/store";

export default function FillerContentType() {
  const types = useAtomValue(typesAtom);
  const [currentType, setCurrentType] = useAtom(fillerAtom);

  function handleChangeType(e: SelectChangeEvent) {
    setCurrentType(
      types.filter((t) => t.id.localeCompare(e.target.value) === 0)[0],
    );
  }

  return (
    <React.Fragment>
      {types.length > 0 && (
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
