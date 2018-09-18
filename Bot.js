// Central Mining Service
const cms = require('./api.js');

class Bot {
  constructor() {
    this.name = '';
    this.location = {};
    this.state = {};
    this.adjacentNodes = [];
    this.target = null;
    this.tasks = [this.register()];
  }

  async register() {
    let data = await cms.requestRegister();
    this.location = {
      x: data.status.location.x,
      y: data.status.location.y
    }
    this.state = data;
    this.name = data.status.id;
    console.log('Registered ==>', this);
    this.tasks.push(this.scan());
  };

  async scan() {
    let data = await cms.requestScan(this.name)
    this.adjacentNodes = data.nodes;
    this.target = this.findClosestNode()
    console.log('Scan ==>', this);
    this.tasks.push(this.move());
  };

  async move() {
    let path;
    if (this.target) {
      path = this.generatePathTowards(this.target)
      let promises = [];
      path.forEach(step => {
        promises.push(cms.requestMove(step.x, step.y, this.name))
      })

      let res = await Promise.all(promises)
      let finalLocation = res[res.length - 1];
      this.location = finalLocation;
      console.log('finalLocation =>', finalLocation)
      // this.tasks.push(this.claimNodes())

    } else { //if no target then move vertically one square x + 1
      let res = await cms.requestMove(this.location.x + 1, this.location.y)
      this.tasks.push(this.scan())
    }


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