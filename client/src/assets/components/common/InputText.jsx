
const InputText = ({ name, label, value, onChange, required, type }) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                {label || name}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                className="form-input"
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}

export default InputText