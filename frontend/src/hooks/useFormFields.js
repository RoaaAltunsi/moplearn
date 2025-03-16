import { useState } from "react";

const useFormFields = (initialValues) => {
    const [fields, setFields] = useState(initialValues);
    const handleChange = (label, value) => {
        setFields({ ...fields, [label]: value });
    }

    // Function to reset fields
    const resetFields = () => {
        setFields(initialValues);
    };

    return { fields, handleChange, resetFields };
}

export default useFormFields;