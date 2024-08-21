import React from 'react';
import { Button } from "@/ui/button.jsx"
import { Input } from "@/ui/input.jsx"

const ComputedTab = ({ computedValues, setComputedValueDialogOpen, removeComputedValue }) => {
  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">Computed Values</h4>
      <Button onClick={() => setComputedValueDialogOpen(true)} className="mb-2">
        Add Computed Value
      </Button>
      {Object.entries(computedValues).map(([id, { name, formula }]) => (
        <div key={id} className="mb-2 p-2 border rounded">
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-600">{formula}</div>
          <Button variant="destructive" size="sm" onClick={() => removeComputedValue(id)} className="mt-1">
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ComputedTab;