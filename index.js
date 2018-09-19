require('dotenv').config();
global.logger = require('tracer').colorConsole({
  format: "{{timestamp}} (in {{file}}:{{line}}) {{message}} ",
  dateformat: "HH:MM:ss.L"
});

const Bot = require('./Bot');

let myBot = new Bot('Charlie');

logger.log('=========');

const run = () => {
  while (myBot.tasks.length >= 1) {
    myBot.tasks.shift();
  }
}

run();