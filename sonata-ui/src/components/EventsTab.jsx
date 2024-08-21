import React from 'react';
import { Button } from "@/ui/button.jsx"

const EventsTab = ({ events, setEventDialogOpen, removeEvent }) => {
  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">Events</h4>
      <Button onClick={() => setEventDialogOpen(true)} className="mb-2">
        Add Event
      </Button>
      {Object.entries(events).map(([elementId, elementEvents]) => (
        <div key={elementId} className="mb-2 p-2 border rounded">
          <div className="font-semibold">Element ID: {elementId}</div>
          {elementEvents.map((event, index) => (
            <div key={index} className="mt-1 p-1 bg-gray-100 rounded">
              <div>Type: {event.type}</div>
              <div>Actions:</div>
              {event.actions.map((action, actionIndex) => (
                <div key={actionIndex} className="ml-2">
                  <div>Type: {action.type}</div>
                  <div>Value: {action.value}</div>
                  {action.condition && <div>Condition: {action.condition}</div>}
                </div>
              ))}
              <div>Target: {event.target}</div>
              <Button variant="destructive" size="sm" onClick={() => removeEvent(elementId, index)} className="mt-1">
                Remove
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EventsTab;