import React, { useState } from 'react';
import { Button } from "@/ui/button.jsx"
import { Badge } from "@/ui/badge.jsx"
import { Icon } from "@/ui/icon.jsx"
import { X, Plus as PlusReact } from 'lucide-react';
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
  [ElementTypes.CONTAINER]: 'box',
  [ElementTypes.SPAN]: 'type',
  [ElementTypes.INPUT]: 'text-cursor-input',
  [ElementTypes.BUTTON]: 'square-asterisk',
  [ElementTypes.HEADING]: 'heading-1',
  [ElementTypes.PARAGRAPH]: 'heading-2',
  [ElementTypes.UNORDERED_LIST]: 'list',
  [ElementTypes.ORDERED_LIST]: 'list',
  [ElementTypes.LIST_ITEM]: 'type',
  [ElementTypes.IMAGE]: 'image',
  [ElementTypes.LINK]: 'link',
  [ElementTypes.SELECT]: 'chevron-down',
  [ElementTypes.CHECKBOX]: 'check-square',
  [ElementTypes.RADIO]: 'toggle-left',
  [ElementTypes.SLIDER]: 'sliders',
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
    const isSelected = selectedElement && path.every((v, i) => v === selectedElement[i]);
    const svgElementName = ElementIcons[element.type];
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
          <Icon svgName={svgElementName} width={16} height={16} className="tw-mr-1" color="black" />
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
            <PlusReact size={16} />
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