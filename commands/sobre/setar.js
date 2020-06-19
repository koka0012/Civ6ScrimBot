const Command = require('../../base/Command.js');
const Info = require('../../base/Schemas/Info.js');

class Setar extends Command {
  constructor (client) {
    super(client, {
      name: 'setar',
      description: 'Setar o texto de um comando',
      usage: 'setar <key> <text>',
      category: 'Sistema',
      permLevel: 'Administrator'
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
  async run (message, [key, ...text]) {
    if (!key) return await message.reply('É necessário passar um comando.');
    if (text.length < 1) return await message.reply('É necessário passar um texto');

    const fullText = text.join(' ');

    const doc = await Info.findOneAndUpdate({key}, {key, value: fullText});
    if (!doc) {
      await Info.create({key, value: fullText});
    }
    await message.reply('Texto definido com sucesso!');
  }
}

module.exports = Setar;