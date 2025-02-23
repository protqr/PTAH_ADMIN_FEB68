import { useState } from "react";
import customFetch from "../../../utils/customFetch";


export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await customFetch.post("/files", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data
}

/**
 * 
 * value = { id?: string, name: string, url?: string, file?: File, size?: number }
 */
const UploadFile = ({ name, label, value, onChange }) => {

    const [file, setFile] = useState(value);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            const newFileVal = {
                file: uploadedFile,
                name: uploadedFile.name,
                size: uploadedFile.size
            }
            setFile(newFileVal);

            if (onChange) {
                onChange({
                    target: {
                        name,
                        value: newFileVal,
                    },
                });
            }
        }


    };

    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                {label || name}
            </label>
            <input
                type="file"
                multiple={false}
                onChange={handleFileChange}
            />
            {value?.id && (
                <div className="py-2">
                    <a className="btn" style={{ textTransform: 'lowercase' }} href={`/api/v1/files/${value.id}`}>{value.name}</a>
                </div>
            )}
        </div>
    );
};
export default UploadFile;
