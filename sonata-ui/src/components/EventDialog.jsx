import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select.jsx';
import { Button } from '@/ui/button.jsx';
import { Label } from '@/ui/label.jsx';
import { Input } from '@/ui/input.jsx';

const EventDialog = ({ currentEvent, setCurrentEvent, addEvent, setEventDialogOpen, setIsSelectingTarget }) => {
  return (
    <AlertDialog open={true} onOpenChange={setEventDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Event</AlertDialogTitle>
          <AlertDialogDescription>
            Define a new event for an element. Use the visual selector to choose the target element.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="elementId" className="text-right">Element ID</Label>
            <Input
              id="elementId"
              value={currentEvent.elementId}
              onChange={(e) => setCurrentEvent(prev => ({ ...prev, elementId: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eventType" className="text-right">Event Type</Label>
            <Select
              value={currentEvent.type}
              onValueChange={(value) => setCurrentEvent(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Click">Click</SelectItem>
                <SelectItem value="Change">Change</SelectItem>
                <SelectItem value="Focus">Focus</SelectItem>
                <SelectItem value="Blur">Blur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Actions</Label>
            <div className="col-span-3">
              {currentEvent.actions && currentEvent.actions.map((action, index) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <Select
                    value={action.type}
                    onValueChange={(value) => {
                      const newActions = [...currentEvent.actions];
                      newActions[index] = { ...newActions[index], type: value };
                      setCurrentEvent(prev => ({ ...prev, actions: newActions }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="set">Set</SelectItem>
                      <SelectItem value="toggle">Toggle</SelectItem>
                      <SelectItem value="increment">Increment</SelectItem>
                      <SelectItem value="decrement">Decrement</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={action.value}
                    onChange={(e) => {
                      const newActions = [...currentEvent.actions];
                      newActions[index] = { ...newActions[index], value: e.target.value };
                      setCurrentEvent(prev => ({ ...prev, actions: newActions }));
                    }}
                    placeholder="Value"
                    className="mt-2"
                  />
                  <Input
                    value={action.condition}
                    onChange={(e) => {
                      const newActions = [...currentEvent.actions];
                      newActions[index] = { ...newActions[index], condition: e.target.value };
                      setCurrentEvent(prev => ({ ...prev, actions: newActions }));
                    }}
                    placeholder="Condition (optional)"
                    className="mt-2"
                  />
                  <Button variant="destructive" size="sm" onClick={() => {
                    const newActions = currentEvent.actions.filter((_, i) => i !== index);
                    setCurrentEvent(prev => ({ ...prev, actions: newActions }));
                  }} className="mt-2">Remove Action</Button>
                </div>
              ))}
              <Button onClick={() => {
                const newActions = [...(currentEvent.actions || []), { type: '', value: '', condition: '' }];
                setCurrentEvent(prev => ({ ...prev, actions: newActions }));
              }} className="mt-2">Add Action</Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">Target</Label>
            <div className="col-span-3 flex items-center">
              <Input
                id="target"
                value={currentEvent.target}
                onChange={(e) => setCurrentEvent(prev => ({ ...prev, target: e.target.value }))}
                className="flex-grow"
                placeholder="e.g., /inputs/input-id"
              />
              <Button onClick={() => setIsSelectingTarget(true)} className="ml-2">Select</Button>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={addEvent}>Add Event</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventDialog;