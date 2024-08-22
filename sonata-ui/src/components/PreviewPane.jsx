import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select.jsx"
import { Switch } from "@/ui/switch.jsx"
import { Moon, Sun } from 'lucide-react';
import ClassesTab from './ClassesTab.jsx';
import ComputedTab from './ComputedTab.jsx';
import EventsTab from './EventsTab.jsx';
import InputsTab from './InputsTab.jsx';
import StorybookTab from './StorybookTab.jsx';
import ReactExportTab from './ReactExportTab.jsx';

const PreviewPane = ({
  previewBreakpoint,
  setPreviewBreakpoint,
  isDarkMode,
  setIsDarkMode,
  previewHtml,
  previewInputs,
  handleInputChange,
  classToggles,
  toggleClass,
  computedValues,
  setComputedValueDialogOpen,
  removeComputedValue,
  events,
  setEventDialogOpen,
  removeEvent,
  breakpoints,
  containers,
  componentDocs,
}) => {
  return (
    <div className="tw-h-screen tw-p-4 tw-overflow-y-auto">
      <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Preview</h3>
      <div className="tw-mb-4 tw-flex tw-items-center tw-justify-between">
        <Select
          value={previewBreakpoint.name}
          onValueChange={(value) => setPreviewBreakpoint(breakpoints.find(b => b.name === value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select breakpoint" />
          </SelectTrigger>
          <SelectContent>
            {breakpoints.map((breakpoint) => (
              <SelectItem key={breakpoint.name} value={breakpoint.name}>
                <div className="tw-flex tw-items-center">
                  <breakpoint.icon className="tw-mr-2 tw-h-4 tw-w-4" />
                  {breakpoint.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="tw-flex tw-items-center">
          <Sun className="tw-h-4 tw-w-4 tw-mr-2" />
          <Switch
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
          <Moon className="tw-h-4 tw-w-4 tw-ml-2" />
        </div>
      </div>
      <Tabs defaultValue="inputs">
        <TabsList>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="computed">Computed</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="storybook">Storybook</TabsTrigger>
        </TabsList>
        <TabsContent value="inputs">
          <InputsTab previewInputs={previewInputs} handleInputChange={handleInputChange} />
        </TabsContent>
        <TabsContent value="classes">
          <ClassesTab classToggles={classToggles} toggleClass={toggleClass} />
        </TabsContent>
        <TabsContent value="computed">
          <ComputedTab computedValues={computedValues} setComputedValueDialogOpen={setComputedValueDialogOpen} removeComputedValue={removeComputedValue} />
        </TabsContent>
        <TabsContent value="events">
          <EventsTab events={events} setEventDialogOpen={setEventDialogOpen} removeEvent={removeEvent} />
        </TabsContent>
        <TabsContent value="storybook">
          <StorybookTab containers={containers} computedValues={computedValues} events={events} componentDocs={componentDocs} />
        </TabsContent>
        <TabsContent value="react-export">
          <ReactExportTab containers={containers} computedValues={computedValues} events={events} previewInputs={previewInputs} />
        </TabsContent>
      </Tabs>
      <div 
        className={`tw-border tw-rounded tw-p-4 ${isDarkMode ? 'tw-bg-gray-800 tw-text-white' : 'tw-bg-white'}`}
        style={{ width: `${previewBreakpoint.width}px`, maxWidth: '100%', margin: '0 auto' }}
      >
        <h4 className="tw-text-md tw-font-semibold tw-mb-2">Live Preview</h4>
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
    </div>
  );
};

export default PreviewPane;