// import readlineSync from 'readline-sync';
import defaultRender from './defaultRenderer';
import flatRender from './flatRenderer';

const renderTypes = {
  default: defaultRender,
  plane: flatRender,
};

const render = (astDiff, formatType) => renderTypes[formatType](astDiff);

export default render;
