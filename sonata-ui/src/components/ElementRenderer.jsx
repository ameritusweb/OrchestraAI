import React from 'react';
import { Button } from '@/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu.jsx';
import { Plus } from 'lucide-react';
import { ElementTypes } from '../constants.js';

const ElementRenderer = ({ element, path, selectedElement, setSelectedElement, addElement, handleDrop }) => {
  const IconComponent = ElementTypes[element.type];
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
      </div>
      <div className="absolute top-0 right-0 flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.values(ElementTypes).map((type) => (
              <DropdownMenuItem key={type} onSelect={() => addElement(path, type)}>
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Render children elements recursively */}
      {(element.type === ElementTypes.CONTAINER || element.type === ElementTypes.UNORDERED_LIST || element.type === ElementTypes.ORDERED_LIST) && (
        <div className="pl-4 border-l-2 border-gray-300">
          {element.children.map((child, index) => (
            <ElementRenderer
              key={index}
              element={child}
              path={[...path, index]}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              addElement={addElement}
              handleDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ElementRenderer;