import { useState } from "react";

const useFormFields = (initialValues) => {
    const [fields, setFields] = useState(initialValues);
    const handleChange = (label, value) => {
        setFields({ ...fields, [label]: value });
    }
    return { fields, handleChange };
}

export default useFormFields;