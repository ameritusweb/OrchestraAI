import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/ui/dialog.jsx"
import { Button } from "@/ui/button.jsx"
import { Tree } from "@/ui/tree.jsx"

const TargetSelectorDialog = ({ 
  open, 
  onOpenChange, 
  containers, 
  generateElementTree 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Target Element</DialogTitle>
        </DialogHeader>
        <Tree>
          {containers.map(container => generateElementTree(container))}
        </Tree>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TargetSelectorDialog;