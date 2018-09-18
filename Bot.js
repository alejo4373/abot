// Central Mining Service
const cms = require('./api.js');

class Bot {
  constructor() {
    this.name = '';
    this.location = {}
    this.state = {}
    this.adjacentNodes = [];
  }

  register(callback) {
    cms.requestRegister((data) => {
      this.location = {
        x: data.status.location.x,
        y: data.status.location.x
      }
      this.state = data;
      this.name = data.status.id;
      console.log('Registered');
      callback(data);
    })
  };

  scan(callback) {
    cms.requestScan(this.name, (data) => {
      this.adjacentNodes = data.nodes;
      callback(data);
    })
  };

  move(path, callback) {
    let promises = [];
    path.forEach(step => {
      promises.push(cms.requestMove(step.x, step.y, this.name))
    })

    Promise.all(promises).then(res => {
      let finalLocation = res[res.length - 1];
      this.location = finalLocation;
      console.log('res=>', res)
      callback(finalLocation)
    })
    .catch(err => {
      console.log('[Error] => Promise.all', err)
    })
  };

  // Brute force path generation, not exploiting the fact the bot
  // can move diagonally.
  generatePathTowards(node) {
    // Bot's current location
    let botX = this.location.x
    let botY = this.location.y

    // Destination node's location
    let nodeX = node.location.x;
    let nodeY = node.location.y;

    let path = [];

    //If node is above bot, rise botX
    while (nodeX > botX) {
      botX += 1
      path.push({ x: botX, y: botY })
    }

    //If node is below bot, lower botX
    while (nodeX < botX) {
      botX -= 1
      path.push({ x: botX, y: botY })
    }

    //If node is to the right of bot, rise botX
    while (nodeY < botY) {
      botY -= 1
      path.push({ x: botX, y: botY })
    }

    //If node is to the left of bot, lower botY
    while (nodeY > botY) {
      botY += 1
      path.push({ x: botX, y: botY })
    }
    return path;
  }


  claimNodes(callback) {
    cms.requestClaim(this.name, (data) => {
      callback(data);
    })
  };

  findClosestNode() {
    // Bot's current location
    let botX = this.location.x
    let botY = this.location.y

    let nodes = this.adjacentNodes;
    let closest = nodes[0];
    nodes.forEach(node => {
      let nodeX = node.location.x;
      let nodeY = node.location.y;
      let absoluteDistance = (nodeX - botX) - (nodeY - botY);
      if (absoluteDistance >= -2 || absoluteDistance <= 2) {
        closest = node;
      }
    })
    return closest;
  }

  release() { };
  mine(node) { };
  conquerMarse() { };



}

module.exports = Bot;