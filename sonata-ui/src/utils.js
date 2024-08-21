export const generatePreviewHtml = (containers) => {
    let html = '';
    const generateElementHtml = (element) => {
      // Generate the HTML based on element type and properties
    };
    html = containers.map(generateElementHtml).join('');
    return html;
  };
  
  export const generateFullClassName = (cls) => {
    if (typeof cls === 'string') return cls;
    const prefixes = cls.prefixes.length > 0 ? cls.prefixes.join(':') + ':' : '';
    return `${prefixes}${cls.name}`;
  };