require('dotenv').config();

const Bot = require('./Bot');

let myBot = new Bot('Charlie');

console.log('=========');
myBot.register((data) => {
  console.log('bot location =>', myBot.location)
  myBot.scan((data) => {
    console.log('scan =>', data);
    console.log('bot location =>', myBot.location)
    let closest = myBot.findClosestNode();
    console.log('closest =>', closest)
    let path;
    if (closest) {
      path = myBot.generatePathTowards(closest)
      myBot.move(path, (finalLocation) => {
        console.log('bot location =>', myBot.location)
      });
    }
  });
});
