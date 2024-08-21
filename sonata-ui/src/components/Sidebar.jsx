import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion.jsx';
import { Button } from '@/ui/button.jsx';
import { ElementTypes, tailwindCategories } from '../constants.js';

const Sidebar = ({ addElement, handleDragStart }) => {
  return (
    <div className="h-screen bg-gray-100 p-4 overflow-y-auto">
      <Button onClick={() => addElement([], ElementTypes.CONTAINER)} className="mb-4">
        Add Container
      </Button>
      <Accordion type="multiple">
        {tailwindCategories.map((category, index) => (
          <AccordionItem value={`category-${index}`} key={index}>
            <AccordionTrigger>{category.name}</AccordionTrigger>
            <AccordionContent>
              {category.subcategories.map((subcategory, subIndex) => (
                <div key={subIndex} className="mb-2">
                  <h4 className="font-semibold mb-1">{subcategory.name}</h4>
                  <div className="flex flex-wrap">
                    {subcategory.classes.map((cls, clsIndex) => (
                      <div
                        key={clsIndex}
                        draggable
                        onDragStart={(e) => handleDragStart(e, cls)}
                        className="bg-blue-200 p-1 m-1 text-sm cursor-move rounded"
                      >
                        {cls}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Sidebar;