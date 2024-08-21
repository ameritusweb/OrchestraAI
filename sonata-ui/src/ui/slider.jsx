import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const Slider = ({ id, min, max, step, value, onValueChange }) => {
  const [localValue, setLocalValue] = useState(value[0]);

  useEffect(() => {
    setLocalValue(value[0]);
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onValueChange([newValue]);
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        className="form-range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
      />
      <div className="slider-value">{localValue}</div>
    </div>
  );
};

Slider.propTypes = {
  id: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  onValueChange: PropTypes.func.isRequired,
};

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
};

// CSS to be added to your project
const sliderStyles = `
.slider-container {
  position: relative;
  padding: 10px 0;
}

.slider-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff;
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.8rem;
}

.form-range::-webkit-slider-thumb {
  background: #007bff;
}

.form-range::-moz-range-thumb {
  background: #007bff;
}

.form-range::-ms-thumb {
  background: #007bff;
}
`;