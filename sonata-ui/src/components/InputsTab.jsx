import React from 'react';
import { Label } from "@/ui/label.jsx"
import { Input } from "@/ui/input.jsx"
import { Checkbox } from "@/ui/checkbox.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select.jsx"
import { Slider } from "@/ui/slider.jsx"

const InputsTab = ({ previewInputs, handleInputChange }) => {
  const renderInput = (element) => {
    switch (element.type) {
      case 'input':
        return (
          <div key={element.id} className="mb-4">
            <Label htmlFor={element.id}>{element.content || 'Input'}</Label>
            <Input
              id={element.id}
              value={previewInputs[element.id] || ''}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              placeholder={element.content || 'Input'}
            />
          </div>
        );
      case 'select':
        return (
          <div key={element.id} className="mb-4">
            <Label htmlFor={element.id}>{element.content || 'Select'}</Label>
            <Select
              value={previewInputs[element.id] || ''}
              onValueChange={(value) => handleInputChange(element.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {(element.options || []).map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'checkbox':
        return (
          <div key={element.id} className="mb-4 flex items-center">
            <Checkbox
              id={element.id}
              checked={previewInputs[element.id] || false}
              onCheckedChange={(checked) => handleInputChange(element.id, checked)}
            />
            <Label htmlFor={element.id} className="ml-2">{element.content || 'Checkbox'}</Label>
          </div>
        );
      case 'slider':
        return (
          <div key={element.id} className="mb-4">
            <Label htmlFor={element.id}>{element.content || 'Slider'}</Label>
            <Slider
              id={element.id}
              min={element.min || 0}
              max={element.max || 100}
              step={element.step || 1}
              value={[previewInputs[element.id] || element.min || 0]}
              onValueChange={([value]) => handleInputChange(element.id, value)}
            />
            <p className="text-sm mt-1">Value: {previewInputs[element.id] || element.min || 0}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">Inputs</h4>
      {Object.entries(previewInputs).map(([id, value]) => renderInput({ id, ...value }))}
    </div>
  );
};

export default InputsTab;