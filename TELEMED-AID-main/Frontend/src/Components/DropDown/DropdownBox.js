import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const DropdownBox = ({
    label,
    name,
    setValue,
    register,
    error,
    helperText,
    options,
}) => {
    return (
        <Autocomplete
            sx={{
                mb: 2,
            }}
            options={options}
            getOptionLabel={(option) => option.label || ""} // Changed from option.name
            onChange={(_, selectedOption) => {
                setValue(name, selectedOption ? selectedOption.value : "", {
                    shouldValidate: true,
                });
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={label}
                    fullWidth
                    error={!!error}
                    helperText={helperText}
                    {...register(name)} // Added register prop
                />
            )}
        />
    );
};

export default DropdownBox;
