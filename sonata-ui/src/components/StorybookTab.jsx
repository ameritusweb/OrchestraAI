import React from 'react';
import { Button } from "@/ui/button.jsx"

const StorybookTab = ({ generateStorybook, exportStorybookConfig }) => {
  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">Storybook</h4>
      <Button onClick={generateStorybook} className="mb-2 mr-2">
        Generate Storybook
      </Button>
      <Button onClick={exportStorybookConfig} className="mb-2">
        Export Storybook Config
      </Button>
    </div>
  );
};

export default StorybookTab;