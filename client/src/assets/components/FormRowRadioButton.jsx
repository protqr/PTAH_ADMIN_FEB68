import React, { useState } from "react";
import Wrapper from "../wrappers/FormRowRadio";

const FormRowRadioButton = ({ name, list = [], value, onChange }) => {
  return (
    <Wrapper>
      <div className="allrela">
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
        </div>
      </div>
    </Wrapper>
  );
};

export default FormRowRadioButton;
