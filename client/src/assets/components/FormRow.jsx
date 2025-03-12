const FormRow = ({ type, name, labelText, defaultValue, value, onChange }) => {
  if (type === "textarea") {
    return (
      <div className="form-row">
        <label htmlFor={name} className="form-label">
          {labelText || name}
        </label>
        <textarea
          id={name}
          name={name}
          className="form-input"
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    );
  }

  // Use controlled component if value and onChange are provided, otherwise use uncontrolled with defaultValue
  const inputProps = value !== undefined && onChange 
    ? { value, onChange } 
    : { defaultValue: defaultValue || "" };

  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-input"
        {...inputProps}
        required
      />
    </div>
  );
};

export default FormRow;
