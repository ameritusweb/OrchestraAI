import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import PreviewPane from './PreviewPane.jsx';
import EventDialog from './EventDialog.jsx';
import { ElementTypes, initialElements } from '../constants.js';
import { ResizablePanel, ResizablePanelGroup } from "@/ui/resizable.jsx";
import ElementRenderer from './ElementRenderer.jsx';

const TailwindBuilder = () => {
  const [containers, setContainers] = useState(initialElements);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState({});
  const [isSelectingTarget, setIsSelectingTarget] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ elementId: '', type: '', actions: [], target: '' });
  const [previewInputs, setPreviewInputs] = useState({});

  const addContainer = () => {
    setContainers(prev => [...prev, { type: 'container', classes: [], children: [] }]);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case ElementTypes.BUTTON: return 'Button';
      case ElementTypes.HEADING: return 'Heading';
      case ElementTypes.PARAGRAPH: return 'Paragraph text';
      case ElementTypes.SPAN: return 'Span text';
      case ElementTypes.LIST_ITEM: return 'List item';
      case ElementTypes.LINK: return 'Link text';
      case ElementTypes.IMAGE: return { src: '/api/placeholder/200/200', alt: 'Placeholder image' };
      case ElementTypes.SELECT: return 'Select an option';
      case ElementTypes.CHECKBOX: return 'Checkbox';
      case ElementTypes.RADIO: return 'Radio Group';
      case ElementTypes.SLIDER: return 'Slider';
      default: return '';
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
        <div className="h-screen p-4 overflow-y-auto">
          <div className="border-2 border-gray-300 p-4 min-h-[300px]">
            {containers.map((container, index) => (
              <ElementRenderer 
                key={index} 
                element={container} 
                path={[index]} 
                selectedElement={selectedElement} 
                setSelectedElement={setSelectedElement}
                addElement={addElement}
                handleDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </ResizablePanel>
      <ResizablePanel defaultSize={25}>
        <PreviewPane 
          events={events} 
          setEventDialogOpen={setEventDialogOpen}
        />
      </ResizablePanel>
      {eventDialogOpen && (
        <EventDialog
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
          addEvent={addEvent}
          setEventDialogOpen={setEventDialogOpen}
          setIsSelectingTarget={setIsSelectingTarget}
        />
      )}
    </ResizablePanelGroup>
  );
};

export default TailwindBuilder;