import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs.jsx";
import { Button } from "@/ui/button.jsx";
import { ScrollArea } from "@/ui/scroll-area.jsx";
import icons from '../iconology/icons.json';
import { Icon } from '@/ui/icon.jsx';

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

const ICONS_PER_PAGE = 12;

const AddElementModal = ({ isOpen, onClose, onAddElement }) => {
  const [selectedTab, setSelectedTab] = useState('container');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagingSpeed, setPagingSpeed] = useState(500); // Start with 500ms delay
  const [isPaging, setIsPaging] = useState(false); // To track if button is pressed

  const totalIcons = Object.keys(icons).length;
  const totalPages = Math.ceil(totalIcons / ICONS_PER_PAGE);

  const handleAddElement = (type, classes = '') => {
    onAddElement(type, classes);
    onClose();
  };

  const paginatedIcons = useMemo(() => {
    const startIndex = (currentPage - 1) * ICONS_PER_PAGE;
    return Object.keys(icons).slice(startIndex, startIndex + ICONS_PER_PAGE);
  }, [currentPage]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePagingStart = () => {
    setIsPaging(true);
    setPagingSpeed(500); // Reset speed
  };

  const handlePagingStop = () => {
    setIsPaging(false);
  };

  useEffect(() => {
    let interval;
    if (isPaging) {
      interval = setInterval(() => {
        handleNextPage();
        setPagingSpeed((prevSpeed) => Math.max(50, prevSpeed * 0.9)); // Increase speed up to a minimum delay of 50ms
      }, pagingSpeed);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPaging, pagingSpeed]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="tw-h-full">
      <DialogContent className="sm:tw-max-w-[800px] tw-h-[75%]">
        <DialogHeader>
          <DialogTitle>Add Element</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue='container' onValueChange={handleTabChange}>
          <TabsList className="tw-grid tw-w-full tw-grid-cols-4">
            <TabsTrigger value="container">Container</TabsTrigger>
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="icon">Icon</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="container">
            <ScrollArea className="tw-h-[300px] tw-w-full tw-rounded-md tw-border tw-p-4">
              <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                {containerTypes.map((container) => (
                  <Button
                    key={container.name}
                    onClick={() => handleAddElement('div', container.classes)}
                    variant="outline"
                    className="tw-justify-start"
                  >
                    {container.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="input">
            <ScrollArea className="tw-h-[300px] tw-w-full tw-rounded-md tw-border tw-p-4">
              <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                {inputTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleAddElement('input', `type="${type}"`)}
                    variant="outline"
                    className="tw-justify-start"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="icon">
            <ScrollArea className="tw-w-full tw-rounded-md tw-border tw-p-4 tw-h-[376px]">
              <div className="tw-grid tw-grid-cols-4 tw-gap-4">
                {paginatedIcons.map((icon) => (
                  <Button
                    key={icon}
                    onClick={() => handleAddElement('icon', icon)}
                    variant="outline"
                    className="tw-justify-space-evenly tw-flex tw-flex-col tw-items-center">
                    <Icon svgName={icon} width={24} height={24} color="black" className="tw-w-6 tw-h-6 tw-mb-2" />
                    <span className="tw-text-xs">{icon}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div className="tw-flex tw-justify-between tw-mt-4">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <Button
                onMouseDown={handlePagingStart}
                onMouseUp={handlePagingStop}
                onMouseLeave={handlePagingStop}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="other">
            <ScrollArea className="tw-max-h-[400px] overflow-auto tw-w-full tw-rounded-md tw-border tw-p-4">
              <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                {otherTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleAddElement(type)}
                    variant="outline"
                    className="tw-justify-start"
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
