import { Smartphone, Tablet, Monitor } from 'lucide-react';

export const ElementTypes = {
  CONTAINER: 'container',
  SPAN: 'span',
  INPUT: 'input',
  BUTTON: 'button',
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  UNORDERED_LIST: 'ul',
  ORDERED_LIST: 'ol',
  LIST_ITEM: 'li',
  IMAGE: 'img',
  LINK: 'a',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SLIDER: 'slider',
};

export const initialElements = [
  // Initial elements if any
];

export const tailwindCategories = [
    {
        name: "Layout",
        subcategories: [
          {
            name: "Container",
            classes: ["container", "mx-auto"]
          },
          {
            name: "Display",
            classes: ["block", "inline-block", "inline", "flex", "inline-flex", "grid", "inline-grid", "hidden"]
          },
          {
            name: "Flexbox",
            classes: ["flex-row", "flex-col", "flex-wrap", "flex-nowrap", "justify-start", "justify-end", "justify-center", "justify-between", "items-start", "items-end", "items-center"]
          },
          {
            name: "Grid",
            classes: ["grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4", "gap-1", "gap-2", "gap-4", "gap-8"]
          }
        ]
      },
      {
        name: "Typography",
        subcategories: [
          {
            name: "Font Family",
            classes: ["font-sans", "font-serif", "font-mono"]
          },
          {
            name: "Font Size",
            classes: ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"]
          },
          {
            name: "Font Weight",
            classes: ["font-light", "font-normal", "font-medium", "font-semibold", "font-bold"]
          },
          {
            name: "Text Color",
            classes: ["text-black", "text-white", "text-gray-500", "text-red-500", "text-blue-500", "text-green-500"]
          }
        ]
      },
      {
        name: "Spacing",
        subcategories: [
          {
            name: "Padding",
            classes: ["p-1", "p-2", "p-4", "p-8", "px-2", "py-2", "pt-2", "pr-2", "pb-2", "pl-2"]
          },
          {
            name: "Margin",
            classes: ["m-1", "m-2", "m-4", "m-8", "mx-2", "my-2", "mt-2", "mr-2", "mb-2", "ml-2"]
          }
        ]
      },
      {
        name: "Backgrounds",
        subcategories: [
          {
            name: "Background Color",
            classes: ["bg-white", "bg-black", "bg-gray-100", "bg-red-100", "bg-blue-100", "bg-green-100"]
          },
          {
            name: "Background Size",
            classes: ["bg-auto", "bg-cover", "bg-contain"]
          }
        ]
      },
      {
        name: "Borders",
        subcategories: [
          {
            name: "Border Width",
            classes: ["border", "border-0", "border-2", "border-4", "border-8"]
          },
          {
            name: "Border Color",
            classes: ["border-black", "border-white", "border-gray-300", "border-red-300", "border-blue-300"]
          },
          {
            name: "Border Radius",
            classes: ["rounded-none", "rounded-sm", "rounded", "rounded-lg", "rounded-full"]
          }
        ]
      }
];

export const breakpoints = [
  { name: 'Mobile', width: 375, icon: Smartphone },
  { name: 'Tablet', width: 768, icon: Tablet },
  { name: 'Desktop', width: 1280, icon: Monitor },
];