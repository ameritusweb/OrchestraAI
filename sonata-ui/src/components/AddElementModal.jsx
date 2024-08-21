import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs,jsx"
import { Button } from "@/ui/button.jsx"
import { ScrollArea } from "@/ui/scroll-area.jsx"
import * as LucideIcons from 'lucide-react';

const containerTypes = [
  { name: 'Flex Centered', classes: 'flex items-center justify-center' },
  { name: 'Flex Row', classes: 'flex flex-row' },
  { name: 'Flex Column', classes: 'flex flex-col' },
  { name: 'Absolute', classes: 'absolute' },
  { name: 'Fixed', classes: 'fixed' },
  { name: 'Relative', classes: 'relative' },
];

const inputTypes = [
  'text', 'password', 'email', 'number', 'date', 'time', 'datetime-local', 
  'checkbox', 'radio', 'file', 'color', 'range', 'tel', 'url'
];

const otherTypes = [
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
  'ul', 'ol', 'li', 'a', 'img', 'button', 'table', 'form'
];

const AddElementModal = ({ isOpen, onClose, onAddElement }) => {
  const [selectedTab, setSelectedTab] = useState('container');

  const handleAddElement = (type, classes = '') => {
    onAddElement(type, classes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Element</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="container" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="container">Container</TabsTrigger>
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="icon">Icon</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="container">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {containerTypes.map((container) => (
                  <Button
                    key={container.name}
                    onClick={() => handleAddElement('div', container.classes)}
                    variant="outline"
                    className="justify-start"
                  >
                    {container.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="input">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {inputTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleAddElement('input', `type="${type}"`)}
                    variant="outline"
                    className="justify-start"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="icon">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-4 gap-4">
                {Object.keys(LucideIcons).map((iconName) => {
                  const IconComponent = LucideIcons[iconName];
                  return (
                    <Button
                      key={iconName}
                      onClick={() => handleAddElement('icon', iconName)}
                      variant="outline"
                      className="flex flex-col items-center justify-center h-20"
                    >
                      <IconComponent className="w-6 h-6 mb-2" />
                      <span className="text-xs">{iconName}</span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="other">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {otherTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleAddElement(type)}
                    variant="outline"
                    className="justify-start"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddElementModal;