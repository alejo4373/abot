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

  it('return appropriate path to walk towards a target node', () => {
    let bot = new Bot();
    bot.location = { x: 88, y: 97 };
    bot.target = {
      id: '08a1838a-b887-4270-88f2-feb170b03993',
      location: { x: 93, y: 96 },
      value: 12,
      claimed: false
    }

    let appropriatePath = [
      { x: 89, y: 97 },
      { x: 90, y: 97 },
      { x: 91, y: 97 },
      { x: 92, y: 97 },
      { x: 93, y: 97 },
      { x: 93, y: 96 }
    ]

    let path = bot.generatePathTowards(bot.target)
    expect(path).toEqual(appropriatePath);
  })
})
