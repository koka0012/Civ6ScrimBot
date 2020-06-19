const Command = require('../../base/Command.js');
const Info = require('../../base/Schemas/Info.js');

class Remapear extends Command {
  constructor (client) {
    super(client, {
      name: 'remapear',
      description: 'Voto para remapear',
      usage: 'remapear',
      category: 'Liga',
    });
  }

  /**
   * @overridew
   *
   *  The funcion to run the command
   *
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @param {number} level
   * @memberof Command
   */
  async run (message) {
    const msg = await Info.findOne({key: 'remapear'});
    if (!msg) return;

    await message.channel.send(msg.value.trim());
  }
}

module.exports = Remapear;