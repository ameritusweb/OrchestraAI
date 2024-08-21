import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion.jsx';
import { Button } from "@/ui/button.jsx"
import { Input } from "@/ui/input.jsx"
import { Label } from "@/ui/label.jsx"
import { Plus, Search } from 'lucide-react';
import { ElementTypes, tailwindCategories } from '../constants.js';

const Sidebar = ({ 
  searchTerm, 
  setSearchTerm, 
  handleDragStart, 
  addContainer 
}) => {

  const filteredCategories = tailwindCategories.map(category => ({
    ...category,
    subcategories: category.subcategories.map(subcategory => ({
      ...subcategory,
      classes: subcategory.classes.filter(cls => 
        cls.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(subcategory => subcategory.classes.length > 0)
  })).filter(category => category.subcategories.length > 0);

  return (
    <div className="h-screen bg-gray-100 p-4 overflow-y-auto">
      <Button onClick={addContainer} className="mb-4">
        Add Container
      </Button>
      <div className="mb-4 relative">
        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-8"
        />
        <Search className="absolute right-2 top-2 text-gray-400" size={20} />
      </div>
      <Accordion type="multiple">
        {filteredCategories.map((category, index) => (
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