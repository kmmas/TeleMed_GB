import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const Title = ({
    title,
    align = "center",
    gutterBottom = true,
    variant = "h4",
    fontWeight = "bold",
    sx = {},
}) => {
    return (
        <Typography
            variant={variant}
            gutterBottom={gutterBottom}
            sx={{
                mb: 4,
                fontWeight: fontWeight,
                textAlign: align,
                ...sx,
            }}
        >
            {title}
        </Typography>
    );
};

Title.propTypes = {
    /** The text to display as title */
    title: PropTypes.string.isRequired,
    /** Alignment of the text */
    align: PropTypes.oneOf(["left", "center", "right", "justify"]),
    /** Whether to add gutter space at bottom */
    gutterBottom: PropTypes.bool,
    /** Typography variant */
    variant: PropTypes.oneOf([
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "subtitle1",
        "subtitle2",
        "body1",
        "body2",
    ]),
    /** Font weight */
    fontWeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(["light", "normal", "medium", "bold"]),
    ]),
    /** Additional sx props */
    sx: PropTypes.object,
};

export default Title;
