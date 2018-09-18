require('dotenv').config();

const Bot = require('./Bot');

let myBot = new Bot('Charlie');

console.log('=========');

const run = () => {
  while (myBot.tasks.length >= 1) {
    myBot.tasks.shift();
  }
}

run();