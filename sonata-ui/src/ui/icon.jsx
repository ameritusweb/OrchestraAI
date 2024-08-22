import React from 'react';
import { parse, stringify } from 'svgson';
import icons from '../iconology/icons.json';

export const Icon = ({ svgName, width, height, color, className }) => {
  const [modifiedSvg, setModifiedSvg] = React.useState(null);

  React.useEffect(() => {
    const modifySvg = async () => {
      // Get the SVG string from the icons object
      const svg = icons[svgName];
      
      if (!svg) {
        console.error(`SVG with name "${svgName}" not found`);
        return;
      }

      // Parse the SVG
      const parsed = await parse(svg);

      // Modify the viewBox if width and height are provided
      if (width && height) {
        // const viewBox = parsed.attributes.viewBox.split(' ');
        // viewBox[2] = width;
        // viewBox[3] = height;
        // parsed.attributes.viewBox = viewBox.join(' ');
        parsed.attributes.width = width;
        parsed.attributes.height = height;
      }

      // Apply color if provided
      if (color) {
        const applyColor = (node) => {
          if (node.attributes.fill && node.attributes.fill !== 'none') {
            node.attributes.fill = color;
          }
          if (node.attributes.stroke && node.attributes.stroke !== 'none') {
            node.attributes.stroke = color;
          }
          if (node.children) {
            node.children.forEach(applyColor);
          }
        };
        applyColor(parsed);
      }

      // Convert back to string
      const modifiedSvg = stringify(parsed);
      setModifiedSvg(modifiedSvg);
    };

    modifySvg();
  }, [svgName, width, height, color]);

  if (!modifiedSvg) return null;

  return <div className={className} dangerouslySetInnerHTML={{ __html: modifiedSvg }} />;
};