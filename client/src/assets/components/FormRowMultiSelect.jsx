import React, { useState } from "react";
import Select, { components } from "react-select";
import Wrapper from "../wrappers/FormRowMultiSelect";

const FormRowMultiSelect = ({
  name,
  labelText,
  options,
  onChange,
  defaultValue = [],
}) => {
  const isOptionAllSelected = (selectedOptions) => {
    return selectedOptions.some((option) => option.value === "ท่าทั้งหมด");
  };

  const formattedOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  const [selectedPostures, setSelectedPostures] = useState(
    Array.isArray(defaultValue)
      ? defaultValue.map((userPosts) => ({
          value: userPosts,
          label: userPosts,
        }))
      : []
  );

  const handleSelectChange = (selectedOptions) => {
    let updatedSelectedPostures;

    if (isOptionAllSelected(selectedOptions)) {
      if (
        selectedOptions.length === 1 ||
        selectedOptions.length === options.length
      ) {
        updatedSelectedPostures = formattedOptions;
      } else {
        updatedSelectedPostures = [];
      }
    } else {
      updatedSelectedPostures = selectedOptions;
    }

    setSelectedPostures(updatedSelectedPostures);

    if (onChange) {
      onChange(updatedSelectedPostures.map((option) => option.value));
    }
  };

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  return (
    <Wrapper>
      <div className="form-row">
        <label htmlFor={name} className="form-label">
          {labelText || name}
        </label>
        <Select
          id={name}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option }}
          onChange={handleSelectChange}
          options={formattedOptions}
          value={selectedPostures}
          className="basic-multi-select w-full z-10"
          classNamePrefix="select"
        />
      </div>
    </Wrapper>
  );
};

export default FormRowMultiSelect;
