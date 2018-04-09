// import readlineSync from 'readline-sync';
import diffRender from './diffRenderer';
import planeRender from './planeRenderer';
import jsonRender from './jsonRenderer';


const renderTypes = {
  default: diffRender,
  plane: planeRender,
  json: jsonRender,
};

const render = (astDiff, formatType) => renderTypes[formatType](astDiff);

export default render;
