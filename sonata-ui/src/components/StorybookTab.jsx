import React from 'react';
import { Button } from "@/ui/button.jsx"
import { generateStorybook, exportStorybookConfig } from '../modules/storybookGenerator.js';

const StorybookTab = ({ containers, computedValues, events, componentDocs }) => {
  const handleGenerateStorybook = () => {
    const stories = generateStorybook(containers, computedValues, events, componentDocs);
    console.log('Generated Storybook stories:', stories);
    // Here you could implement logic to save these stories to files
  };

  const handleExportStorybookConfig = () => {
    const config = exportStorybookConfig();
    console.log('Storybook config:', config);
    // Here you could implement logic to save this config to a file
  };

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">Storybook</h4>
      <Button onClick={handleGenerateStorybook} className="mb-2 mr-2">
        Generate Storybook
      </Button>
      <Button onClick={handleExportStorybookConfig} className="mb-2">
        Export Storybook Config
      </Button>
    </div>
  );
};

export default StorybookTab;