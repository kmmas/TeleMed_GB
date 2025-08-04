import React, { useEffect } from "react";
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {FormControlStyles} from "@Components/DropDown/DropDownStyles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      maxWidth: 5,
      overflowX: "auto"
    },
  },
};

const DropDown = ({
  state,
  setState,
  name,
  defaultFirst,
  classname,
  setIsEmpty,
  isEmpty,
  label,
  items,
  placeholder,
  size,
  dropDownError,
  helperText,
  extraProps,
}) => {

  useEffect(() => {
    if (defaultFirst && items.length > 0 && !state) {
      setState(items[0].id);
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function handleOnChange(e) {
   const selectedValue = e.target.value; 
   setState(selectedValue);
   if(isEmpty){
    setIsEmpty(false);
   }
  }
  return (
    <FormControlStyles size={size} variant="outlined" className={classname} fullWidth error={dropDownError}>
      {label && <InputLabel id="batch-label">{label}</InputLabel>}

      <Select
        
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        value={state || (defaultFirst && items.length > 0 ? items[0].id : "")}
        displayEmpty
        error={dropDownError}
        placeholder={placeholder}
        fullWidth
        MenuProps={MenuProps}
        {...extraProps}
        onChange={handleOnChange}
        sx={{
          color: items.length > 0 && state === items[0].id ? "text.disabled" : "inherit",
        }}
      >
        {items?.map((item, index) => (
            <MenuItem key={item.id} value={item.id} disabled={index === 0}>
              {item.name}
            </MenuItem>
        ))}
      </Select>
      {isEmpty&& (<Typography variant="body2" color="error" marginTop={1}>{name} is required</Typography>)}
      {helperText && (
       <Typography variant="body2" color="error" marginTop={1}>
        {helperText}
       </Typography>
      )}
    </FormControlStyles>
  );
};

export default DropDown;
