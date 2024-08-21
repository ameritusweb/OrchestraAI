import { generateFullClassName } from '../utils.js';

export const generateStorybook = (containers, computedValues, events, componentDocs) => {
  const stories = [];
  
  const processElement = (element, parentPath = []) => {
    if (element.type === 'container' && element.isStoryComponent) {
      const componentName = getComponentName(element);
      const storyCode = generateStoryCode(element, componentName, parentPath, computedValues, events, componentDocs);
      stories.push({
        name: componentName,
        code: storyCode
      });
    }
    if (element.children) {
      element.children.forEach((child, index) => processElement(child, [...parentPath, index]));
    }
  };

  containers.forEach((container, index) => processElement(container, [index]));

  return stories;
};

const getComponentName = (element) => {
  return `Component${element.id}`;
};

const generateStoryCode = (element, componentName, path, computedValues, events, componentDocs) => {
  const componentCode = generateReactComponent(element, componentName, computedValues, events);
  const docs = componentDocs[path.join('-')] || { description: '', props: [] };

  // Generate variations based on states and responsive classes
  const variations = generateVariations(element);

  return `
import React from 'react';
import { Meta, Story, ArgsTable, Canvas } from '@storybook/addon-docs/blocks';
import ${componentName} from './${componentName}';

<Meta
  title="Components/${componentName}"
  component={${componentName}}
  argTypes={{
    ${docs.props.map(prop => `
    ${prop.name}: {
      description: '${prop.description}',
      control: { type: '${prop.type}' },
    }`).join(',\n    ')}
  }}
/>

# ${componentName}

${docs.description}

<Canvas>
  <Story name="Default">
    {(args) => <${componentName} {...args} />}
  </Story>
</Canvas>

## Props

<ArgsTable of={${componentName}} />

${variations.map(variation => `
export const ${variation.name} = {
  args: {
    className: "${variation.classes.join(' ')}"
  },
};
`).join('\n')}
  `.trim();
};

const generateReactComponent = (element, componentName, computedValues, events) => {
  const classNames = element.classes.map(generateFullClassName).join(' ');
  const elementEvents = events[element.id] || [];

  const componentCode = `
import React, { useState, useEffect } from 'react';

const ${componentName} = ({ className, ...props }) => {
  const [state, setState] = useState({
    // Initialize state based on inputs and computed values
  });

  useEffect(() => {
    // Effect for computed values
  }, [/* dependencies */]);

  const handleEvent = (eventType) => {
    ${elementEvents.map(event => `
    if (eventType === '${event.type}') {
      ${event.actions.map(action => `
      // Handle ${action.type} action
      `).join('\n')}
    }
    `).join('\n')}
  };

  return (
    <div className={\`\${className} ${classNames}\`} {...props}>
      {/* Render child elements */}
    </div>
  );
};

export default ${componentName};
  `.trim();

  return componentCode;
};

const generateVariations = (element) => {
  const variations = [{ name: 'Default', classes: element.classes.map(generateFullClassName) }];
  
  // Generate variations based on responsive classes
  const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
  breakpoints.forEach(breakpoint => {
    const breakpointClasses = element.classes
      .filter(cls => typeof cls === 'object' && cls.name.startsWith(`${breakpoint}:`))
      .map(cls => cls.name);
    
    if (breakpointClasses.length > 0) {
      variations.push({
        name: `${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}Screen`,
        classes: [...variations[0].classes, ...breakpointClasses]
      });
    }
  });

  // Generate variations based on states (hover, focus, etc.)
  const states = ['hover', 'focus', 'active', 'disabled'];
  states.forEach(state => {
    const stateClasses = element.classes
      .filter(cls => typeof cls === 'object' && cls.name.startsWith(`${state}:`))
      .map(cls => cls.name);
    
    if (stateClasses.length > 0) {
      variations.push({
        name: `${state.charAt(0).toUpperCase() + state.slice(1)}State`,
        classes: [...variations[0].classes, ...stateClasses]
      });
    }
  });

  return variations;
};

export const exportStorybookConfig = () => {
  return `
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs'
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5"
  }
};
  `.trim();
};