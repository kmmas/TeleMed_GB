
const validateData = (data,validationSchema) => {
    const { error } = validationSchema.validate(data, {
        abortEarly: false,
    });
    if (error) {
        return error.details.reduce((acc, detail) => {
            acc[detail.path[0]] = detail.message;
            return acc;
        }, {});
    } else {
        return {};
    }
};

const validateForm = (data,setErrors,validationSchema,condition = false, nullField = null) => {
    if (condition&& nullField) data[nullField] = null;

    const newErrors = validateData(data,validationSchema);
    if (Object.keys(newErrors).length === 0) {
        return true;
    }
    setErrors(newErrors);
    return false;
};

// Handle form submission
const submitFormWithValidation = async (data,condition=false, nullField,setErrors,validationSchema) => {
    if (validateForm(data,setErrors,validationSchema,condition, nullField)) {
        return data;
    } else {
        return null;
    }
};

export {submitFormWithValidation,validateData,validateForm};
