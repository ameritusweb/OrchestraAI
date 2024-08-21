  export const generateFullClassName = (cls) => {
    if (typeof cls === 'string') return cls;
    const prefixes = cls.prefixes.length > 0 ? cls.prefixes.join(':') + ':' : '';
    return `${prefixes}${cls.name}`;
  };