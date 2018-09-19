// Central Mining Service
const cms = require('./api.js');

class Bot {
  constructor() {
    this.name = '';
    this.location = {};
    this.state = {};
    this.inRangeNodes = [];
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
    logger.log('botLocation ==>', this.location)
    this.tasks.push(this.scan());
  };

  async scan() {
    let data = await cms.requestScan(this.name)
    if (data.nodes.length) {
      this.inRangeNodes = data.nodes;

      // I could claim at least 3 nodes in my range but I think it will be better
      // to claim closest node and then start moving towards it
      this.target = this.findClosestNode()
      logger.log('inRangeNodes =>', this.inRangeNodes)
      this.claimNode(this.target)
    }
    // Regardless of if we have a target node move!!!
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
      logger.log('res ======');
      res.forEach(r => {
        logger.log('r ====>', r);
      })
      let finalLocation = res[res.length - 1];
      this.location = finalLocation.location;
      logger.log('finalLocation =>', this.location)

    } else { //if no target then move vertically one square x + 1, like that for now
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


  async claimNode(node) {
    let claimResponse = await cms.requestClaim(this.name, node)
    logger.log('claimResponse =>', claimResponse)
  };

  findClosestNode() {
    // Bot's current location
    let botX = this.location.x
    let botY = this.location.y

    let nodes = this.inRangeNodes;

    let closestNode = null;
    let leastDistance = null;

    nodes.forEach(node => {
      let nodeX = node.location.x;
      let nodeY = node.location.y;
      let nodeDistance = Math.abs((nodeX - botX)) + Math.abs((nodeY - botY));
      console.log('nodeDistance', nodeDistance);
      if (leastDistance === null) {
        leastDistance = nodeDistance;
        closestNode = node;
      } else if (nodeDistance <= leastDistance) {
        leastDistance = nodeDistance
        closestNode = node;
      }
    })
    
    console.log('end ================== \n \n');
    return closestNode;
  }

  release() { };
  mine(node) { };
  conquerMarse() { };



}

module.exports = Bot;