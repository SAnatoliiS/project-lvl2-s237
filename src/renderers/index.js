// import readlineSync from 'readline-sync';
import defaultRenderer from './defaultRenderer';
// import flatRenderer from './flatRenderer';

function DefaultRender() {
  this.exec = defaultRenderer;
}
/*
DefaultRender.prototype = new DefaultRender();
DefaultRender.prototype.constructor = DefaultRender;

function FlatRender() {
  this.exec = flatRenderer;
}
FlatRender.prototype = new DefaultRender();
FlatRender.prototype.constructor = FlatRender;
*/
function Context(renderType) {
  function choisenRenderer(astConfigTree) {
    return renderType.exec(astConfigTree);
  }
  this.exec = choisenRenderer;
}
const renderer = new Context(new DefaultRender()).exec;

export default renderer;
