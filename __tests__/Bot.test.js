global.logger = require('tracer').colorConsole({
  format: "{{timestamp}} (in {{file}}:{{line}}) {{message}} ",
  dateformat: "HH:MM:ss.L"
});
const Bot = require('../Bot');
require('dotenv').config();

describe('Bot class', () => {
  it('finds closest node to bot', () => {
    let bot = new Bot()
    bot.location = { x: 15, y: 78 };
    bot.inRangeNodes = [
      {
        id: '985c7d4f-127b-4b1e-902d-c06e2e85a273',
        location: { x: 17, y: 81 },
        value: 5,
        claimed: false
      },
      {
        id: 'bd40498c-a2be-429d-a0ca-06b0fa1635d3',
        location: { x: 14, y: 81 },
        value: 16,
        claimed: false
      },
      {
        id: 'e9283cfd-b148-422f-a50d-e9b53d31e6f0',
        location: { x: 15, y: 81 },
        value: 11,
        claimed: false
      }
    ]
    let closest = bot.findClosestNode();
    expect(closest).toBe(bot.inRangeNodes[2])
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

  it.only('bot`s location is updated after a move request', async () => {
    expect.assertions(1);
    let bot = new Bot();
    await bot.register();
    let initialLocation = bot.location;
    await bot.step(initialLocation.x + 1, initialLocation.y + 1)
    let finalLocation = bot.location;
    expect(finalLocation).not.toEqual(initialLocation)
  })
})
