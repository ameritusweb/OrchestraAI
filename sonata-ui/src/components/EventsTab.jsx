import React from 'react';
import { Button } from "@/ui/button.jsx"

const EventsTab = ({ events, setEventDialogOpen, removeEvent }) => {
  return (
    <div className="tw-mb-6">
      <h4 className="tw-text-md tw-font-semibold tw-mb-2">Events</h4>
      <Button onClick={() => setEventDialogOpen(true)} className="tw-mb-2">
        Add Event
      </Button>
      {Object.entries(events).map(([elementId, elementEvents]) => (
        <div key={elementId} className="tw-mb-2 tw-p-2 tw-border tw-rounded">
          <div className="tw-font-semibold">Element ID: {elementId}</div>
          {elementEvents.map((event, index) => (
            <div key={index} className="tw-mt-1 tw-p-1 tw-bg-gray-100 tw-rounded">
              <div>Type: {event.type}</div>
              <div>Actions:</div>
              {event.actions.map((action, actionIndex) => (
                <div key={actionIndex} className="tw-ml-2">
                  <div>Type: {action.type}</div>
                  <div>Value: {action.value}</div>
                  {action.condition && <div>Condition: {action.condition}</div>}
                </div>
              ))}
              <div>Target: {event.target}</div>
              <Button variant="destructive" size="sm" onClick={() => removeEvent(elementId, index)} className="tw-mt-1">
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