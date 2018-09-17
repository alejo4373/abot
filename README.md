# A bot that mines nodes

This is a bot that that doesn't know how to do anything on its own, it has to talk to a web server to ask for instructions all the time.

### My Approach: 
Once the bot registers with the sever, it scans its surroundings in search of nodes that could be mined. It will find the closes node that can be mined and start it's journey towards it. Once the node to be mined is reached, it will claim it putting a flag on it and start mining until the resources in the node run out. When the bot finishes mining a given node, it will repeat these steps starting with the scanning, until there are no more resources to mine in the planet.


## Overall thoughts
* I realized that the local server when doing a `scan` will return nodes that were farther away than a 5x5 grid?. Which should not be possible.
* 

## Tradeoffs
* An incomplete, useless still bot in favor of good architectural object oriented design.

## If I had more time
* I wanna make CLI-GUI to visualize the bot and map. 
