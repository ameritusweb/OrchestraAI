import React, { useState } from 'react';
import { Button } from "@/ui/button.jsx"
import { Badge } from "@/ui/badge.jsx"
import { Plus, Search, Box, Type, TextCursorInput as InputIcon, X, SquareAsterisk, Heading1, Heading2, List, Image, Link, Moon, Sun, Smartphone, Tablet, Monitor, BookOpen, Tag, CheckSquare, ToggleLeft, ChevronDown, Sliders } from 'lucide-react';
import AddElementModal from './AddElementModal.jsx';

const ElementTypes = {
  CONTAINER: 'container',
  SPAN: 'span',
  INPUT: 'input',
  BUTTON: 'button',
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  UNORDERED_LIST: 'ul',
  ORDERED_LIST: 'ol',
  LIST_ITEM: 'li',
  IMAGE: 'img',
  LINK: 'a',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SLIDER: 'slider',
};
  
const ElementIcons = {
  [ElementTypes.CONTAINER]: Box,
  [ElementTypes.SPAN]: Type,
  [ElementTypes.INPUT]: InputIcon,
  [ElementTypes.BUTTON]: SquareAsterisk,
  [ElementTypes.HEADING]: Heading1,
  [ElementTypes.PARAGRAPH]: Heading2,
  [ElementTypes.UNORDERED_LIST]: List,
  [ElementTypes.ORDERED_LIST]: List,
  [ElementTypes.LIST_ITEM]: Type,
  [ElementTypes.IMAGE]: Image,
  [ElementTypes.LINK]: Link,
  [ElementTypes.SELECT]: ChevronDown,
  [ElementTypes.CHECKBOX]: CheckSquare,
  [ElementTypes.RADIO]: ToggleLeft,
  [ElementTypes.SLIDER]: Sliders,
};

const MainBuilder = ({ 
  containers, 
  setContainers,
  selectedElement,
  setSelectedElement,
  handleDrop,
  toggleReactComponent,
  toggleStoryComponent,
  addElement,
  removeClass,
  removePrefix,
}) => {
  const [isAddElementModalOpen, setIsAddElementModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

  const openAddElementModal = (path) => {
    setCurrentPath(path);
    setIsAddElementModalOpen(true);
  };

  const handleAddElement = (type, classes = '') => {
    addElement(currentPath, type, classes);
  };

  const renderElement = (element, path = []) => {
    const IconComponent = ElementIcons[element.type];
    const isSelected = selectedElement && path.every((v, i) => v === selectedElement[i]);

    return (
      <div 
        key={path.join('-')}
        className={`tw-border-2 tw-border-dashed tw-p-4 tw-m-2 tw-relative ${isSelected ? 'tw-border-blue-500' : 'tw-border-gray-300'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, path)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(path);
        }}
      >
        <div className="tw-absolute tw-top-0 tw-left-0 tw-bg-gray-200 tw-px-2 tw-py-1 tw-text-xs tw-flex tw-items-center">
          <IconComponent size={16} className="mr-1" />
          {element.type}
          {element.type === ElementTypes.CONTAINER && (
            <>
              <input
                type="checkbox"
                checked={element.isReactComponent}
                onChange={() => toggleReactComponent(path)}
                className="tw-ml-2"
              />
              <label className="tw-ml-1 tw-mr-2">React</label>
              <input
                type="checkbox"
                checked={element.isStoryComponent}
                onChange={() => toggleStoryComponent(path)}
                className="tw-ml-2"
              />
              <label className="tw-ml-1">Story</label>
            </>
          )}
        </div>
        <div className="tw-absolute tw-top-0 tw-right-0">
          <Button 
            size="sm"
            variant="outline" 
            onClick={() => openAddElementModal(path)}
          >
            <Plus size={16} />
          </Button>
        </div>
        <div className="tw-mt-8 tw-mb-2 tw-flex tw-flex-wrap">
          {element.classes.map((cls, index) => (
            <div key={index} className="tw-bg-blue-100 tw-text-blue-800 tw-text-xs tw-font-semibold tw-mr-2 tw-mb-2 tw-px-2.5 tw-py-0.5 tw-rounded tw-flex tw-items-center">
              {typeof cls === 'object' ? (
                <>
                  <div className="tw-flex tw-flex-wrap tw-items-center tw-mr-1">
                    {cls.prefixes.map((prefix, prefixIndex) => (
                      <Badge key={prefixIndex} variant="outline" className="tw-mr-1 tw-mb-1">
                        {prefix}
                        <X 
                          size={8} 
                          className="tw-ml-1 tw-cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            removePrefix(path, cls.name, prefix);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                  <span className="tw-mr-1">{cls.name}</span>
                </>
              ) : cls}
              <X 
                size={12} 
                className="tw-ml-1 tw-cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeClass(path, typeof cls === 'object' ? cls.name : cls);
                }}
              />
            </div>
          ))}
        </div>
        {element.content && <div className="tw-text-sm">{element.content}</div>}
        {(element.type === ElementTypes.CONTAINER || element.type === ElementTypes.UNORDERED_LIST || element.type === ElementTypes.ORDERED_LIST) && (
          <div className="tw-pl-4 tw-border-l-2 tw-border-gray-300">
            {element.children.map((child, index) => renderElement(child, [...path, index]))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen p-4 overflow-y-auto">
      <div className="border-2 border-gray-300 p-4 min-h-[300px]">
        {containers.map((container, index) => renderElement(container, [index]))}
      </div>
      <AddElementModal 
        isOpen={isAddElementModalOpen}
        onClose={() => setIsAddElementModalOpen(false)}
        onAddElement={handleAddElement}
      />
    </div>
  );
};

export default MainBuilder;