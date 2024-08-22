import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion.jsx';
import { Button } from "@/ui/button.jsx"
import { Input } from "@/ui/input.jsx"
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/ui/tabs.jsx"
import { Plus, Search } from 'lucide-react';
import { ElementTypes, tailwindCategories, TailwindPrefixes } from '../constants.js';

const Sidebar = ({ 
  searchTerm, 
  setSearchTerm, 
  handleDragStart, 
  addContainer,
  addClassGroup,
  removeClassGroup,
  setNewGroupName,
  setNewGroupClasses,
  classGroups,
  newGroupName,
  newGroupClasses,
  removeStorybookState,
  storybookStates,
  addStorybookState,
  newStateName,
  setNewStateName,
  prefixSearch,
  setPrefixSearch,
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
    <div className="tw-h-screen tw-p-4 tw-overflow-y-auto">
      <Button onClick={addContainer} className="tw-mb-4">
        Add Container
      </Button>
      <div className="tw-mb-4 tw-relative">
        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tw-pr-8"
        />
        <Search className="tw-absolute tw-right-2 tw-top-2 tw-text-gray-400" size={20} />
      </div>
      <Tabs defaultValue="classes">
            <TabsList>
              <TabsTrigger value="utilityClasses">Classes</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="utilityClasses">
              <Accordion type="multiple">
                {filteredCategories.map((category, index) => (
                  <AccordionItem value={`category-${index}`} key={`${index}`}>
                    <AccordionTrigger>{category.name}</AccordionTrigger>
                    <AccordionContent>
                      {category.subcategories.map((subcategory, subIndex) => (
                        <div key={subIndex} className="tw-mb-2">
                          <h4 className="tw-font-semibold tw-mb-1">{subcategory.name}</h4>
                          <div className="tw-flex tw-flex-wrap">
                            {subcategory.classes.map((cls, clsIndex) => (
                              <div
                                key={clsIndex}
                                draggable
                                onDragStart={(e) => handleDragStart(e, cls)}
                                className="tw-bg-blue-200 tw-p-1 tw-m-1 tw-text-sm tw-cursor-move tw-rounded"
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
            </TabsContent>
            <TabsContent value="groups">
              <div className="tw-mb-4">
                <Input
                  placeholder="Group Name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="tw-mb-2"
                />
                <Input
                  placeholder="Classes (space-separated)"
                  value={newGroupClasses}
                  onChange={(e) => setNewGroupClasses(e.target.value)}
                  className="tw-mb-2"
                />
                <Button onClick={addClassGroup}>Add Group</Button>
              </div>
              {classGroups.map((group, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, `group:${index}`)}
                  className="tw-bg-blue-200 tw-p-2 tw-mb-2 tw-rounded"
                >
                  <h4 className="tw-font-semibold">{group.name}</h4>
                  <p className="tw-text-sm">{group.classes.join(' ')}</p>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeClassGroup(index)}
                    className="tw-mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="states">
              <div className="tw-mb-4">
                <Input
                  placeholder="New State Name"
                  value={newStateName}
                  onChange={(e) => setNewStateName(e.target.value)}
                  className="tw-mb-2"
                />
                <Button onClick={addStorybookState}>Add State</Button>
              </div>
              {storybookStates.map((state, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text', `state:${state}`)}
                  className="tw-bg-green-200 tw-p-2 tw-mb-2 tw-rounded tw-flex tw-justify-between tw-items-center"
                >
                  <span>{state}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeStorybookState(state)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="prefixes">
              <div className="tw-mb-4">
                <Input
                  placeholder="Search prefixes..."
                  value={prefixSearch}
                  onChange={(e) => setPrefixSearch(e.target.value)}
                  className="tw-mb-2"
                />
              </div>
              {TailwindPrefixes.filter(prefix => 
                prefix.name.toLowerCase().includes(prefixSearch.toLowerCase()) ||
                prefix.description.toLowerCase().includes(prefixSearch.toLowerCase())
              ).map((prefix, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text', `prefix:${prefix.name}`)}
                  className="tw-bg-purple-200 tw-p-2 tw-mb-2 tw-rounded tw-flex tw-justify-between tw-items-center"
                >
                  <span className="tw-font-semibold">{prefix.name}</span>
                  <span className="tw-text-sm tw-text-gray-600">{prefix.description}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
    </div>
  );
};

export default Sidebar;