const Command = require('../../base/Command.js');
const Info = require('../../base/Schemas/Info.js');

class Desistir extends Command {
  constructor (client) {
    super(client, {
      name: 'desistir',
      description: 'Desistir da partida',
      usage: 'desistir',
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
    const msg = await Info.findOne({key: 'desistir'});
    if (!msg) return;

    await message.channel.send(msg.value.trim());
  }
}

module.exports = Desistir;