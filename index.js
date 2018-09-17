const Bot = require('./Bot');

let myBot = new Bot('Charlie');

console.log('=========');
myBot.register((data) => {
  // console.log('===> myBot', myBot);
  myBot.scan((data) => {
    console.log('bot location =>', myBot.location)
    let closest = myBot.findClosestNode();
    console.log('closest =>', closest)
    let path;
    let promises = [];
    if (closest) {
      path = myBot.generatePathTowards(closest)
      promises = path.map(coords => {
        return myBot.move(coords.x, coords.y)
      })
      console.log(path)
      Promise.all(promises).then(vals => {
        console.log('vals=>', vals[vals.length - 1]);
      })
    }
  });
});
