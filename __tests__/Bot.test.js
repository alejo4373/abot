const Bot = require('../Bot');

describe('Bot class', () => {
  it('finds closest node to bot', () => {
    let bot = new Bot()
    bot.location = { x: 22, y: 14 };
    bot.inRangeNodes = [{
      id: '692422d0-d553-48eb-b302-6b72fd928a4d',
      location: { x: 22, y: 13 },
      value: 18,
      claimed: false
    },
    {
      id: 'bf436066-a75d-4833-91c5-2e63d5c146bc',
      location: { x: 25, y: 18 },
      value: 15,
      claimed: false
    }]

    let closest = bot.findClosestNode();
    expect(closest).toBe(bot.inRangeNodes[0])
  })

  it('finds closest path between two nodes in the grid', () => {
  })
})
