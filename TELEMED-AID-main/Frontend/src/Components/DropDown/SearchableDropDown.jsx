import React from "react";
import {
    FormControl,
    Typography,
    Autocomplete,
    TextField,
    CircularProgress,
} from "@mui/material";

const SearchableDropDown = ({
                                state,
                                setState,
                                name,
                                classname,
                                setIsEmpty,
                                isEmpty,
                                label,
                                items,
                                placeholder,
                                size,
                                dropDownError,
                                helperText,
                                loading = false, // Default value set to false
                                disabled,
                            }) => {
    const initializedItems = Array.isArray(items) ? items : [];

    // Derive the selected option from the id stored in state
    const selectedOption = initializedItems.find(option => option.name === state) || null;

    function handleOnChange(_, selectedOption) {
        if (selectedOption) {
            setState(selectedOption.name); // update state with the id only
        } else {
            setState(""); // or set to null if you prefer
        }
    }

    return (
        <FormControl variant="outlined" className={classname} fullWidth>
            {label && <label id="batch-label">{label}</label>}
            <Autocomplete
                size={size}
                value={selectedOption} // pass the object, not the id
                onChange={handleOnChange}
                options={initializedItems}
                getOptionLabel={(item) => item.name || ""}
                loading={loading} // Set loading state
                disabled={disabled}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        placeholder={loading?"Loading options...":placeholder}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                        disabled = {disabled}
                    />

                )}
                loadingText="Loading options..." // Customize loading text
            />
            {isEmpty && (
                <Typography variant="body2" color="red" marginTop={1}>
                    {name} is required
                </Typography>
            )}
            {helperText && (
                <Typography variant="body2" color="red" marginTop={1}>
                    {helperText}
                </Typography>
            )}
        </FormControl>
    );
};

export default SearchableDropDown;
