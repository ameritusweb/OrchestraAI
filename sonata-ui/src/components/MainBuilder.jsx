import React, { useState } from 'react';
import { Button } from "@/ui/button.jsx"
import { Plus, Box, Type, Input as InputIcon, SquareAsterisk, Heading1, Heading2, List, Image, Link } from 'lucide-react';
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
    LINK: 'a'
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
    [ElementTypes.LINK]: Link
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
  removeClass
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
        className={`border-2 border-dashed p-4 m-2 relative ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, path)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(path);
        }}
      >
        <div className="absolute top-0 left-0 bg-gray-200 px-2 py-1 text-xs flex items-center">
          <IconComponent size={16} className="mr-1" />
          {element.type}
          {element.type === ElementTypes.CONTAINER && (
            <>
              <input
                type="checkbox"
                checked={element.isReactComponent}
                onChange={() => toggleReactComponent(path)}
                className="ml-2"
              />
              <label className="ml-1 mr-2">React</label>
              <input
                type="checkbox"
                checked={element.isStoryComponent}
                onChange={() => toggleStoryComponent(path)}
                className="ml-2"
              />
              <label className="ml-1">Story</label>
            </>
          )}
        </div>
        <div className="absolute top-0 right-0">
          <Button 
            size="sm"
            variant="outline" 
            onClick={() => openAddElementModal(path)}
          >
            <Plus size={16} />
          </Button>
        </div>
        <div className="mt-8 mb-2 flex flex-wrap">
          {element.classes.map((cls, index) => (
            <div key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center">
              {typeof cls === 'object' ? cls.name : cls}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeClass(path, typeof cls === 'object' ? cls.name : cls);
                }}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        {element.content && <div className="text-sm">{element.content}</div>}
        {element.children && element.children.map((child, index) => renderElement(child, [...path, index]))}
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