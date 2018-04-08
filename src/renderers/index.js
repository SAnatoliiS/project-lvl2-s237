// import readlineSync from 'readline-sync';
import diffRender from './diffRenderer';
import planeRender from './planeRenderer';

const renderTypes = {
  default: diffRender,
  plane: planeRender,
};

const render = (astDiff, formatType) => renderTypes[formatType](astDiff);

export default render;
