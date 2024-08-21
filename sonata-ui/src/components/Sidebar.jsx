import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion.jsx';
import { Button } from "@/ui/button.jsx"
import { Input } from "@/ui/input.jsx"
import { Label } from "@/ui/label.jsx"
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
      <Tabs defaultValue="classes">
            <TabsList>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="classes">
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
            </TabsContent>
            <TabsContent value="groups">
              <div className="mb-4">
                <Input
                  placeholder="Group Name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="Classes (space-separated)"
                  value={newGroupClasses}
                  onChange={(e) => setNewGroupClasses(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={addClassGroup}>Add Group</Button>
              </div>
              {classGroups.map((group, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, `group:${index}`)}
                  className="bg-blue-200 p-2 mb-2 rounded"
                >
                  <h4 className="font-semibold">{group.name}</h4>
                  <p className="text-sm">{group.classes.join(' ')}</p>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeClassGroup(index)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="states">
              <div className="mb-4">
                <Input
                  placeholder="New State Name"
                  value={newStateName}
                  onChange={(e) => setNewStateName(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={addStorybookState}>Add State</Button>
              </div>
              {storybookStates.map((state, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text', `state:${state}`)}
                  className="bg-green-200 p-2 mb-2 rounded flex justify-between items-center"
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
              <div className="mb-4">
                <Input
                  placeholder="Search prefixes..."
                  value={prefixSearch}
                  onChange={(e) => setPrefixSearch(e.target.value)}
                  className="mb-2"
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
                  className="bg-purple-200 p-2 mb-2 rounded flex justify-between items-center"
                >
                  <span className="font-semibold">{prefix.name}</span>
                  <span className="text-sm text-gray-600">{prefix.description}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
    </div>
  );
};

export default Sidebar;