import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/ui/dialog.jsx';

const ComputedValueDialog = ({ 
    computedValueDialogOpen,
    setComputedValueDialogOpen,
    setCurrentComputedValue,
    currentComputedValue
  }) => {
    return (
<AlertDialog open={computedValueDialogOpen} onOpenChange={setComputedValueDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Computed Value</AlertDialogTitle>
            <AlertDialogDescription>
              Define a new computed value. Use $input.inputId to reference input values.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentComputedValue.name}
                onChange={(e) => setCurrentComputedValue(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formula" className="text-right">
                Formula
              </Label>
              <Input
                id="formula"
                value={currentComputedValue.formula}
                onChange={(e) => setCurrentComputedValue(prev => ({ ...prev, formula: e.target.value }))}
                className="col-span-3"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={addComputedValue}>Add</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      );
    };
    
    export default ComputedValueDialog;