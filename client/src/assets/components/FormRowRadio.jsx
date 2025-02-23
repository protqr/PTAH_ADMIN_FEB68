import React, { useState } from "react";
import Wrapper from "../wrappers/FormRowRadio";

const FormRowRadio = ({
  name,
  list = [],
  value,
  onChange,
  otherOption,
  otherValue,
  onOtherChange,
}) => {
  return (
    <Wrapper>
    <div className="allrela">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        ความเกี่ยวข้องของผู้ดูแล :
      </label>
      <br />
      <br />
      <div id={name} className="allradibut">
        {list.map((option) => (
          <div key={option} className="radibut">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              className="h-4 w-4 text-blue-600 border-blue-300 focus:ring-blue-500"
            />
            <label className="ml-6 text-sm text-gray-700">{option}</label>
          </div>
        ))}
        {value === otherOption && (
          <div className="otherrela">
            <input
              type="text"
              name="otherRelations"
              value={otherValue}
              onChange={onOtherChange}
              placeholder="โปรดระบุความสัมพันธ์"
              className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        )}
      </div>
    </div>
    </Wrapper>
  );
};

export default FormRowRadio;
