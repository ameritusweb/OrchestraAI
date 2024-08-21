import React from 'react';
import PropTypes from 'prop-types';

const StepContext = React.createContext({
  current: 0,
  onChange: (current) => {},
  totalSteps: 0,
});

export const Steps = ({ current, onChange, children }) => {
  const totalSteps = React.Children.count(children);

  return (
    <StepContext.Provider value={{ current, onChange, totalSteps }}>
      <div className="steps d-flex justify-content-between align-items-center">
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, { index, totalSteps })
        )}
      </div>
    </StepContext.Provider>
  );
};

Steps.propTypes = {
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const Step = ({ index, title, totalSteps }) => {
  const { current, onChange } = React.useContext(StepContext);

  const status =
    index < current ? 'complete' : index === current ? 'current' : 'upcoming';

  return (
    <div
      className={`step ${status} ${index === 0 ? 'first' : ''} ${
        index === totalSteps - 1 ? 'last' : ''
      }`}
      onClick={() => onChange(index)}
    >
      <div className="step-indicator">{status === 'complete' ? '✓' : index + 1}</div>
      <div className="step-title">{title}</div>
    </div>
  );
};

Step.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

Steps.Step = Step;
