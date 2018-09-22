// Central Mining Service
const cms = require('./api.js');

class Bot {
  constructor() {
    this.name = '';
    this.location = {};
    this.score = 0;
    this.automatic = false;
    this.state = {};
    this.inRangeNodes = [];
    this.target = null;
    this.tasks = [];
  }

  async register() {
    this.currentTask = 'register';
    let data = await cms.requestRegister();
    this.location = {
      x: data.status.location.x,
      y: data.status.location.y
    }
    this.state = data;
    this.name = data.status.id;
    logger.log('botLocation ==>', this.location)
    if (this.automatic) {
      this.tasks.push(this.scan);
    }
  };

  async scan() {
    this.currentTask = 'scan';
    logger.log('Scanning ====>')
    let data = await cms.requestScan(this.name)
    if (data.nodes.length) {
      this.inRangeNodes = data.nodes;

      // I could claim at least 3 nodes in my range but I think it will be better
      // to claim closest node and then start moving towards it
      this.target = this.findClosestNode()

      //If found node with value, claim it. Otherwise move
      if (this.target) {
        logger.log('inRangeNodes =>', this.inRangeNodes)
        this.claimNode(this.target)
      }
    }
    // Regardless of if we have a target node move!!!
    if (this.automatic) {
      this.tasks.push(this.move);
    }
  };

  async move() {
    this.currentTask = 'move';
    let path;
    if (this.target) {
      path = this.generatePathTowards(this.target)

      //Asynchronous Loop
      for (let step of path) {
        await this.step(step.x, step.y)
      }

      if (this.automatic) {
        this.tasks.push(this.mine);
      }

    } else { //if no target then move randomly and repeat scan
      let x = this.location.x;
      let y = this.location.y;
      if ((x >= 0 && x < 100) && (y >= 0 && y < 100)) {
        let possible = [-1, 0, 1]
        let randomX = possible[Math.floor(Math.random() * 3)];
        let randomY = possible[Math.floor(Math.random() * 3)];
        await this.step(this.location.x + randomX, this.location.y + randomY)
        this.tasks.push(this.scan)
      }

    }


  };

  async step(x, y) {
    let stepRes = await cms.requestMove(x, y, this.name)
    this.location = stepRes.status.location;
    logger.log('moved to =>', this.location)
  }

  // Brute force path generation, not exploiting the fact the bot
  // can move diagonally. 
  // TODO: If equidistant nodes then decide on mining potential
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
      //If we haven't exploited the node already
      if (node.value > 0) {
        let nodeX = node.location.x;
        let nodeY = node.location.y;
        let nodeDistance = Math.abs((nodeX - botX)) + Math.abs((nodeY - botY));
        if (leastDistance === null) {
          leastDistance = nodeDistance;
          closestNode = node;
        } else if (nodeDistance <= leastDistance) {
          leastDistance = nodeDistance
          closestNode = node;
        }
      }
    })
    return closestNode;
  }

  async mine() {
    this.currentTask = 'mine';
    let hitsResult = [];
    while (this.target.value > 0) {
      let crrHit = await cms.requestMine(this.name, this.target);
      hitsResult.push(crrHit);
      this.target.value--;
      this.score++;
    }
    await this.release();
    this.tasks.push(this.scan)
  };

  async release() {
    await cms.requestRelease(this.name, this.target);
  };

  async conquerMars(automatic) {
    this.automatic = automatic;
    this.tasks.push(this.register)
    while (this.tasks.length >= 1) {
      let crrTask = this.tasks.shift();
      crrTask = crrTask.bind(this);
      try {
        await crrTask();
      } catch (err) {
        logger.log('[Error] ==>', err)
      }
    }
  };



}

module.exports = Bot;