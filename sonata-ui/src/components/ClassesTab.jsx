import React from 'react';
import { Switch } from "@/ui/switch.jsx"
import { Label } from "@/ui/label.jsx"

const ClassesTab = ({ classToggles, toggleClass }) => {
  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">Utility Classes</h4>
      {Object.entries(classToggles).map(([classKey, isActive]) => {
        const [elementId, className] = classKey.split('-');
        return (
          <div key={classKey} className="flex items-center justify-between mb-2">
            <Label htmlFor={classKey} className="flex-grow">{className}</Label>
            <Switch
              id={classKey}
              checked={isActive}
              onCheckedChange={() => toggleClass(elementId, className)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ClassesTab;