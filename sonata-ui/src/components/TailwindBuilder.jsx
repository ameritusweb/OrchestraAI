import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import PreviewPane from './PreviewPane.jsx';
import EventDialog from './EventDialog.jsx';
import { ElementTypes, initialElements } from '../constants.js';
import { ResizablePanel, ResizablePanelGroup } from "@/ui/resizable.jsx";
import { breakpoints } from '../constants.js';
import MainBuilder from './MainBuilder.jsx';
import TargetSelectorDialog from './TargetSelectorDialog.jsx';
import { TreeItem } from '@/ui/tree.jsx';
import ComputedValueDialog from './ComputedValueDialog.jsx';
import { generateFullClassName } from '../utils.js';

const TailwindBuilder = () => {
  const [containers, setContainers] = useState(initialElements);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState({});
  const [isSelectingTarget, setIsSelectingTarget] = useState(false);
  const [classToggles, setClassToggles] = useState({});
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ elementId: '', type: '', actions: [], target: '' });
  const [previewInputs, setPreviewInputs] = useState({});
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewBreakpoint, setPreviewBreakpoint] = useState(breakpoints[2]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [computedValues, setComputedValues] = useState({});
  const [componentDocs, setComponentDocs] = useState({});
  const [computedValueDialogOpen, setComputedValueDialogOpen] = useState(false);
  const [currentComputedValue, setCurrentComputedValue] = useState({ id: '', name: '', formula: '' });

  const removeComputedValue = (id) => {
    setComputedValues(prev => {
      const newComputedValues = { ...prev };
      delete newComputedValues[id];
      return newComputedValues;
    });
  };
  
  const toggleClass = (id, className) => {
    setClassToggles(prev => ({
      ...prev,
      [id]: prev[id] === className ? '' : className,
    }));
  };

  const handleInputChange = (inputId, value) => {
    setPreviewInputs(prev => ({
      ...prev,
      [inputId]: value
    }));
  };

  const addContainer = () => {
    setContainers(prev => [...prev, { type: 'container', classes: [], children: [] }]);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case ElementTypes.BUTTON:
        return 'Button';
      case ElementTypes.HEADING:
        return 'Heading';
      case ElementTypes.PARAGRAPH:
        return 'Paragraph text';
      case ElementTypes.SPAN:
        return 'Span text';
      case ElementTypes.LIST_ITEM:
        return 'List item';
      case ElementTypes.LINK:
        return 'Link text';
      case ElementTypes.IMAGE:
        return { src: '/api/placeholder/200/200', alt: 'Placeholder image' };
      case ElementTypes.SELECT:
        return ['Option 1', 'Option 2', 'Option 3'];
      case ElementTypes.CHECKBOX:
      case ElementTypes.RADIO:
        return ['Option 1', 'Option 2'];
      case ElementTypes.SLIDER:
        return { min: 0, max: 100, step: 1 };
      default:
        return '';
    }
  };

  const addElement = (parentPath, type) => {
    const newElement = {
      type,
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
      classes: [],
      children: [],
      content: getDefaultContent(type),
    };
    setContainers(prevContainers => {
      const newContainers = [...prevContainers];
      let targetContainer = newContainers;
      for (let i = 0; i < parentPath.length; i++) {
        targetContainer = targetContainer[parentPath[i]].children;
      }
      targetContainer.push(newElement);
      return newContainers;
    });
  };

  const removeClass = (path, classToRemove) => {
    setContainers(prevContainers => {
      const newContainers = JSON.parse(JSON.stringify(prevContainers));
      let targetElement = newContainers;
      for (const index of path) {
        targetElement = targetElement[index].children;
      }
      targetElement.classes = targetElement.classes.filter(cls => 
        cls !== classToRemove && (typeof cls !== 'object' || cls.name !== classToRemove)
      );
      return newContainers;
    });
  };

  const handleEvent = (elementId, eventType) => {
    const elementEvents = events[elementId] || [];
    elementEvents.forEach(event => {
      if (event.type === eventType) {
        const [action, value] = event.action.split(':');
        const targetPath = event.target.split('/').filter(Boolean);
        
        setPreviewInputs(prev => {
          const newInputs = { ...prev };
          let target = newInputs;
          for (let i = 0; i < targetPath.length - 1; i++) {
            if (!target[targetPath[i]]) {
              target[targetPath[i]] = {};
            }
            target = target[targetPath[i]];
          }
          const lastKey = targetPath[targetPath.length - 1];
          
          switch (action) {
            case 'set':
              target[lastKey] = value;
              break;
            case 'toggle':
              target[lastKey] = !target[lastKey];
              break;
            case 'increment':
              target[lastKey] = (parseFloat(target[lastKey]) || 0) + parseFloat(value);
              break;
            case 'decrement':
              target[lastKey] = (parseFloat(target[lastKey]) || 0) - parseFloat(value);
              break;
            // Add more action types as needed
          }
          
          return newInputs;
        });
      }
    });
  };

  const generatePreviewHtml = () => {
    let html = '';
    const generateElementHtml = (element) => {
      const activeClasses = element.classes
        .filter((cls) => {
          const classKey = `${element.id}-${typeof cls === 'object' ? cls.name : cls}`;
          return classToggles[classKey] !== false;
        })
        .map(generateFullClassName)
        .join(' ');

      switch (element.type) {
        case ElementTypes.CONTAINER:
          return `<div class="${activeClasses}">${element.children.map(generateElementHtml).join('')}</div>`;
        case ElementTypes.SPAN:
          return `<span class="${activeClasses}">${element.content}</span>`;
        case ElementTypes.INPUT:
          const inputId = `input-${element.id}`;
          const inputValue = previewInputs[inputId] || '';
          return `<input id="${inputId}" class="${activeClasses}" type="text" value="${inputValue}" placeholder="${element.content || 'Input'}" />`;
        case ElementTypes.BUTTON:
          return `<button class="${activeClasses}">${element.content || 'Button'}</button>`;
        case ElementTypes.HEADING:
          return `<h2 class="${activeClasses}">${element.content || 'Heading'}</h2>`;
        case ElementTypes.PARAGRAPH:
          return `<p class="${activeClasses}">${element.content || 'Paragraph text'}</p>`;
        case ElementTypes.SELECT:
          const selectId = `select-${element.id}`;
          const selectValue = previewInputs[selectId] || '';
          return `
            <select id="${selectId}" class="${activeClasses}">
              ${(element.options || []).map((option) =>
                `<option value="${option}" ${selectValue === option ? 'selected' : ''}>${option}</option>`
              ).join('')}
            </select>
          `;
        case ElementTypes.CHECKBOX:
          const checkboxId = `checkbox-${element.id}`;
          const isChecked = previewInputs[checkboxId] || false;
          return `
            <div class="flex items-center">
              <input type="checkbox" id="${checkboxId}" class="${activeClasses}" ${isChecked ? 'checked' : ''} />
              <label for="${checkboxId}" class="ml-2">${element.content || 'Checkbox'}</label>
            </div>
          `;
        case ElementTypes.RADIO:
          const radioName = `radio-${element.id}`;
          return `
            <div class="${activeClasses}">
              ${(element.options || []).map((option, index) => {
                const radioId = `${radioName}-${index}`;
                const isChecked = previewInputs[radioName] === option;
                return `
                  <div class="flex items-center mb-2">
                    <input type="radio" id="${radioId}" name="${radioName}" value="${option}" class="${activeClasses}" ${isChecked ? 'checked' : ''} />
                    <label for="${radioId}" class="ml-2">${option}</label>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        case ElementTypes.SLIDER:
          const sliderId = `slider-${element.id}`;
          const sliderValue = previewInputs[sliderId] || element.min || 0;
          return `
            <div class="${activeClasses}">
              <input type="range" id="${sliderId}" min="${element.min || 0}" max="${element.max || 100}" value="${sliderValue}" class="w-full" />
              <p>Value: ${sliderValue}</p>
            </div>
          `;
        default:
          return '';
      }
    };

    html = containers.map(generateElementHtml).join('');
    setPreviewHtml(html);
  };

  useEffect(() => {
    generatePreviewHtml();
  }, [containers, previewInputs, isDarkMode, classToggles]);

  const handleDragStart = (e, className) => {
    e.dataTransfer.setData('text/plain', className);
  };

  const addEvent = () => {
    if (currentEvent.elementId && currentEvent.type && currentEvent.actions.length && currentEvent.target) {
      setEvents(prev => ({
        ...prev,
        [currentEvent.elementId]: [
          ...(prev[currentEvent.elementId] || []),
          { type: currentEvent.type, actions: currentEvent.actions, target: currentEvent.target }
        ]
      }));
      setCurrentEvent({ elementId: '', type: '', actions: [], target: '' });
      setEventDialogOpen(false);
    }
  };

  const handleDrop = (e, elementPath) => {
    e.preventDefault();
    const className = e.dataTransfer.getData('text');
  
    setContainers(prevContainers => {
      const newContainers = [...prevContainers]; // Shallow copy of the containers array
      let targetElement = newContainers[elementPath[0]];
  
      // Traverse the path to the correct element
      for (let i = 1; i < elementPath.length; i++) {
        if (targetElement.children) {
          targetElement = targetElement.children[elementPath[i]];
        } else {
          console.error("Target element doesn't have children at the specified path");
          return prevContainers; // Exit early if the path is invalid
        }
      }
  
      // Add the className if it doesn't already exist
      if (!targetElement.classes.includes(className)) {
        targetElement.classes.push(className);
      }
  
      return newContainers;
    });
  };

  const removeEvent = (elementId, index) => {
    setEvents(prev => {
      const newEvents = { ...prev };
      newEvents[elementId] = newEvents[elementId].filter((_, i) => i !== index);
      return newEvents;
    });
  };

  const toggleReactComponent = (path) => {
    setContainers(prevContainers => {
      const newContainers = JSON.parse(JSON.stringify(prevContainers));
      let targetElement = newContainers;
      for (const index of path) {
        targetElement = targetElement[index].children;
      }
      targetElement.isReactComponent = !targetElement.isReactComponent;
      return newContainers;
    });
  };

  const toggleStoryComponent = (path) => {
    setContainers(prevContainers => {
      const newContainers = JSON.parse(JSON.stringify(prevContainers));
      let targetElement = newContainers;
      for (const index of path) {
        targetElement = targetElement[index].children;
      }
      targetElement.isStoryComponent = !targetElement.isStoryComponent;
      return newContainers;
    });
  };

  const generateElementTree = (element, path = '') => {
    const currentPath = path ? `${path}/${element.id}` : element.id;
    return (
      <TreeItem
        key={currentPath}
        id={currentPath}
        label={`${element.type} (${element.id})`}
      >
        {element.children && element.children.map(child => generateElementTree(child, currentPath))}
      </TreeItem>
    );
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25}>
      <Sidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDragStart={handleDragStart}
          addContainer={addContainer}
        />
      </ResizablePanel>
      <ResizablePanel defaultSize={50}>
        <MainBuilder
          containers={containers}
          setContainers={setContainers}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          handleDrop={handleDrop}
          toggleReactComponent={toggleReactComponent}
          toggleStoryComponent={toggleStoryComponent}
          addElement={addElement}
          removeClass={removeClass}
        />
      </ResizablePanel>
      <ResizablePanel defaultSize={25}>
        <PreviewPane 
          previewBreakpoint={previewBreakpoint}
          setPreviewBreakpoint={setPreviewBreakpoint}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          previewHtml={previewHtml}
          previewInputs={previewInputs}
          handleInputChange={handleInputChange}
          classToggles={classToggles}
          toggleClass={toggleClass}
          computedValues={computedValues}
          removeComputedValue={removeComputedValue}
          events={events} 
          setEventDialogOpen={setEventDialogOpen}
          containers={containers}
          componentDocs={componentDocs}
          removeEvent={removeEvent}
          breakpoints={breakpoints}
          setComputedValueDialogOpen={setComputedValueDialogOpen}
        />
      </ResizablePanel>
      {eventDialogOpen && (
        <EventDialog
          open={eventDialogOpen}
          onOpenChange={setEventDialogOpen}
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
          addEvent={addEvent}
          setIsSelectingTarget={setIsSelectingTarget}
        />
      )}
      {isSelectingTarget && (
        <TargetSelectorDialog
          open={isSelectingTarget}
          onOpenChange={setIsSelectingTarget}
          containers={containers}
          generateElementTree={generateElementTree}
        />
      )}
      {computedValueDialogOpen && (
        <ComputedValueDialog
          computedValueDialogOpen={computedValueDialogOpen}
          setComputedValueDialogOpen={setComputedValueDialogOpen}
          setCurrentComputedValue={setCurrentComputedValue}
          currentComputedValue={currentComputedValue}
        />
      )}
    </ResizablePanelGroup>
  );
};

export default TailwindBuilder;