import React, { useState, useEffect } from 'react';
import { ElementTypes } from '../constants.js';
import { generateFullClassName } from '../utils.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select.jsx';
import { Switch } from '@/ui/switch.jsx';
import { Label } from '@/ui/label.jsx';
import { Checkbox } from '@/ui/checkbox.jsx';
import { Slider } from '@/ui/slider.jsx';
import { Input } from '@/ui/input.jsx';
import { breakpoints } from '../constants.js';
import { Moon, Sun } from 'lucide-react';

const PreviewPane = ({ containers,  events,
  setEvents,
  currentEvent,
  setCurrentEvent,
  eventDialogOpen,
  setEventDialogOpen,
  isSelectingTarget,
  setIsSelectingTarget,
  addEvent }) => {
  const [previewInputs, setPreviewInputs] = useState({});
  const [previewHtml, setPreviewHtml] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewBreakpoint, setPreviewBreakpoint] = useState(breakpoints[2]);
  const [classToggles, setClassToggles] = useState({});

  useEffect(() => {
    generatePreviewHtml();
  }, [containers, previewInputs, isDarkMode]);

  const generatePreviewHtml = () => {
    let html = '';
    const generateElementHtml = (element) => {
      const activeClasses = element.classes
        .filter(cls => {
          const classKey = `${element.id}-${typeof cls === 'object' ? cls.name : cls}`;
          return classToggles[classKey] !== false;
        })
        .map(generateFullClassName)
        .join(' ');
      
      const elementEvents = events[element.id] || [];
      const eventAttributes = elementEvents.map(event => 
        `on${event.type}="handleEvent('${element.id}', '${event.type}')"`
      ).join(' ');
      
      switch (element.type) {
        case ElementTypes.CONTAINER:
          return `<div class="${activeClasses}" ${eventAttributes}>${element.children.map(generateElementHtml).join('')}</div>`;
        case ElementTypes.SPAN:
          return `<span class="${activeClasses}" ${eventAttributes}>${element.content}</span>`;
        case ElementTypes.INPUT:
          const inputId = `input-${element.id}`;
          const inputValue = previewInputs[inputId] || '';
          return `<input id="${inputId}" class="${activeClasses}" type="text" value="${inputValue}" placeholder="${element.content || 'Input'}" ${eventAttributes} />`;
        // ... (handle other element types similarly)
      }
    };

    html = containers.map(generateElementHtml).join('');
    setPreviewHtml(html);
  };

  const handleInputChange = (inputId, value) => {
    setPreviewInputs(prev => ({
      ...prev,
      [inputId]: value
    }));
  };

  const toggleClass = (elementId, className) => {
    const classKey = `${elementId}-${className}`;
    setClassToggles(prev => ({
      ...prev,
      [classKey]: !prev[classKey]
    }));
  };

  const renderPreviewInputs = () => {
    const inputs = [];
    const findInputs = (element) => {
      switch (element.type) {
        case ElementTypes.INPUT:
          const inputId = `input-${element.id}`;
          inputs.push(
            <div key={inputId} className="mb-4">
              <Label htmlFor={inputId}>{element.content || 'Input'}</Label>
              <Input
                id={inputId}
                value={previewInputs[inputId] || ''}
                onChange={(e) => handleInputChange(inputId, e.target.value)}
                placeholder={element.content || 'Input'}
              />
            </div>
          );
          break;
        case ElementTypes.SELECT:
          const selectId = `select-${element.id}`;
          inputs.push(
            <div key={selectId} className="mb-4">
              <Label htmlFor={selectId}>{element.content || 'Select'}</Label>
              <Select
                value={previewInputs[selectId] || ''}
                onValueChange={(value) => handleInputChange(selectId, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {(element.options || []).map((option, index) => (
                    <SelectItem key={index} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
          break;
        case ElementTypes.CHECKBOX:
          const checkboxId = `checkbox-${element.id}`;
          inputs.push(
            <div key={checkboxId} className="mb-4 flex items-center">
              <Checkbox
                id={checkboxId}
                checked={previewInputs[checkboxId] || false}
                onCheckedChange={(checked) => handleInputChange(checkboxId, checked)}
              />
              <Label htmlFor={checkboxId} className="ml-2">{element.content || 'Checkbox'}</Label>
            </div>
          );
          break;
        case ElementTypes.RADIO:
          const radioName = `radio-${element.id}`;
          inputs.push(
            <div key={radioName} className="mb-4">
              <Label>{element.content || 'Radio Group'}</Label>
              {(element.options || []).map((option, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="radio"
                    id={`${radioName}-${index}`}
                    name={radioName}
                    value={option}
                    checked={previewInputs[radioName] === option}
                    onChange={() => handleInputChange(radioName, option)}
                    className="mr-2"
                  />
                  <Label htmlFor={`${radioName}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          );
          break;
        case ElementTypes.SLIDER:
          const sliderId = `slider-${element.id}`;
          inputs.push(
            <div key={sliderId} className="mb-4">
              <Label htmlFor={sliderId}>{element.content || 'Slider'}</Label>
              <Slider
                id={sliderId}
                min={element.min || 0}
                max={element.max || 100}
                step={element.step || 1}
                value={[previewInputs[sliderId] || element.min || 0]}
                onValueChange={([value]) => handleInputChange(sliderId, value)}
              />
              <p className="text-sm mt-1">Value: {previewInputs[sliderId] || element.min || 0}</p>
            </div>
          );
          break;
      }
      if (element.children) {
        element.children.forEach(findInputs);
      }
    };
    containers.forEach(findInputs);
    return inputs;
  };

  const renderClassToggles = () => {
    const toggles = [];
    const findClasses = (element) => {
      element.classes.forEach(cls => {
        const className = typeof cls === 'object' ? cls.name : cls;
        const classKey = `${element.id}-${className}`;
        toggles.push(
          <div key={classKey} className="flex items-center justify-between mb-2">
            <Label htmlFor={classKey} className="flex-grow">{className}</Label>
            <Switch
              id={classKey}
              checked={classToggles[classKey] !== false}
              onCheckedChange={() => toggleClass(element.id, className)}
            />
          </div>
        );
      });
      if (element.children) {
        element.children.forEach(findClasses);
      }
    };
    containers.forEach(findClasses);
    return toggles;
  };

  return (
    <div className="h-screen p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <div className="mb-4 flex items-center justify-between">
        <Select
          value={previewBreakpoint.name}
          onValueChange={(value) => setPreviewBreakpoint(breakpoints.find(b => b.name === value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select breakpoint" />
          </SelectTrigger>
          <SelectContent>
            {breakpoints.map((breakpoint) => (
              <SelectItem key={breakpoint.name} value={breakpoint.name}>
                <div className="flex items-center">
                  <breakpoint.icon className="mr-2 h-4 w-4" />
                  {breakpoint.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center">
          <Sun className="h-4 w-4 mr-2" />
          <Switch
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
          <Moon className="h-4 w-4 ml-2" />
        </div>
      </div>
      <Tabs defaultValue="inputs">
        <TabsList>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>
        <TabsContent value="inputs">
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">Inputs</h4>
            {renderPreviewInputs()}
          </div>
        </TabsContent>
        <TabsContent value="classes">
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">Utility Classes</h4>
            {renderClassToggles()}
          </div>
        </TabsContent>
      </Tabs>
      <div 
        className={`border rounded p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
        style={{ width: `${previewBreakpoint.width}px`, maxWidth: '100%', margin: '0 auto' }}
      >
        <h4 className="text-md font-semibold mb-2">Live Preview</h4>
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
    </div>
  );
};

export default PreviewPane;