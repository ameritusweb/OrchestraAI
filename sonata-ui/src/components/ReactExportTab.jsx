import React, { useState } from 'react';
import { Button } from "@/ui/button.jsx"
import { Textarea } from "@/ui/textarea.jsx"
import { Label } from "@/ui/label.jsx"

const ReactExportTab = ({ containers, computedValues, events, previewInputs }) => {
  const [generatedCode, setGeneratedCode] = useState('');

  const generateReactComponent = () => {
    let imports = `import React, { useState, useEffect } from 'react';\n`;

    let stateDeclarations = `
  const [state, setState] = useState({
    inputs: {
      ${Object.keys(previewInputs).map(id => `'${id}': ''`).join(',\n      ')}
    },
    computed: {
      ${Object.keys(computedValues).map(id => `'${id}': ''`).join(',\n      ')}
    }
  });
`;

    let useEffectHook = `
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      computed: {
        ${Object.entries(computedValues).map(([id, { name, formula }]) => `
        '${id}': (() => {
          try {
            ${formula.replace(/\$input\.([\w-]+)/g, (match, inputId) => `const ${inputId} = prevState.inputs['${inputId}'] || 0;`)}
            return ${formula.replace(/\$input\.([\w-]+)/g, inputId => inputId)};
          } catch (error) {
            console.error('Error computing ${name}:', error);
            return 'Error';
          }
        })()
        `).join(',\n        ')}
      }
    }));
  }, [${Object.keys(previewInputs).map(id => `state.inputs['${id}']`).join(', ')}]);
`;

    let eventHandler = `
  const handleEvent = (elementId, eventType) => {
    ${Object.entries(events).map(([elementId, elementEvents]) => `
    if (elementId === '${elementId}') {
      ${elementEvents.map(event => `
      if (eventType === '${event.type}') {
        ${event.actions.map(action => `
        {
          ${action.condition ? `if (${action.condition}) {` : ''}
          const targetPath = '${event.target}'.split('/').filter(Boolean);
          setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState));
            let target = newState;
            for (let i = 0; i < targetPath.length - 1; i++) {
              if (!target[targetPath[i]]) {
                target[targetPath[i]] = {};
              }
              target = target[targetPath[i]];
            }
            const lastKey = targetPath[targetPath.length - 1];
            
            switch ('${action.type}') {
              case 'set':
                target[lastKey] = ${JSON.stringify(action.value)};
                break;
              case 'toggle':
                target[lastKey] = !target[lastKey];
                break;
              case 'increment':
                target[lastKey] = (parseFloat(target[lastKey]) || 0) + ${action.value};
                break;
              case 'decrement':
                target[lastKey] = (parseFloat(target[lastKey]) || 0) - ${action.value};
                break;
              case 'custom':
                // Execute custom function
                const customFunction = ${action.value};
                target[lastKey] = customFunction(newState, target[lastKey]);
                break;
            }
            
            return newState;
          });
          ${action.condition ? '}' : ''}
        }`).join('\n        ')}
      }`).join('\n      ')}
    }`).join('\n    ')}
  };
`;

    const generateElementJsx = (element) => {
      const classNames = element.classes.map(cls => typeof cls === 'object' ? cls.name : cls).join(' ');
      const elementEvents = events[element.id] || [];
      const eventProps = elementEvents.reduce((props, event) => {
        props[`on${event.type}`] = `() => handleEvent('${element.id}', '${event.type}')`;
        return props;
      }, {});
      
      switch (element.type) {
        case 'container':
          return `
  <div
    className="${classNames}"
    ${Object.entries(eventProps).map(([prop, value]) => `${prop}={${value}}`).join(' ')}
  >
    ${element.children.map(generateElementJsx).join('\n    ')}
  </div>
`;
        case 'input':
          return `
  <input
    id="${element.id}"
    className="${classNames}"
    value={state.inputs['${element.id}']}
    onChange={(e) => setState(prev => ({ ...prev, inputs: { ...prev.inputs, '${element.id}': e.target.value } }))}
    placeholder="${element.content || 'Input'}"
    ${Object.entries(eventProps).map(([prop, value]) => `${prop}={${value}}`).join(' ')}
  />
`;
        // Add cases for other element types as needed
        default:
          return '';
      }
    };

    let jsx = `
  return (
    <div>
      ${containers.map(generateElementJsx).join('\n      ')}
      {/* Computed Values Display */}
      <div>
        ${Object.entries(computedValues).map(([id, { name }]) => `
        <div>
          <strong>${name}:</strong> {state.computed['${id}']}
        </div>
        `).join('\n        ')}
      </div>
    </div>
  );
`;

    const fullComponent = `
${imports}

const YourComponent = () => {
${stateDeclarations}
${useEffectHook}
${eventHandler}
${jsx}
}

export default YourComponent;
`;

    setGeneratedCode(fullComponent);
  };

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">React Export</h4>
      <Button onClick={generateReactComponent} className="mb-2">
        Generate React Component
      </Button>
      {generatedCode && (
        <div>
          <Label htmlFor="generated-code">Generated React Component:</Label>
          <Textarea
            id="generated-code"
            value={generatedCode}
            readOnly
            className="mt-2 h-[400px]"
          />
        </div>
      )}
    </div>
  );
};

export default ReactExportTab;