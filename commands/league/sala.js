const Command = require('../../base/Command.js');
const Player = require('../../base/Schemas/Player.js');
const moment = require('moment');

class Sala extends Command {
  constructor (client) {
    super(client, {
      name: 'sala',
      description: 'Ver o elo de todos do canal de voz atual',
      usage: 'sala',
      category: 'Liga',
    });
  }

  /**
   * @override
   *
   *  The funcion to run the command
   *
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @param {number} level
   * @memberof Command
   */
  async run (message) {
    if (message.channel.type != 'text') {return;}
    if (!message.guild.member(message.author.id).voice.channel) {return message.reply('Você precisa estar conectado em um canal de voz');}

    const roles = ['Colono', 'Chefe', 'Senhor da Guerra', 'Príncipe', 'Rei', 'Imperador', 'Imortal', 'Divindade'];

    const channelVoice = message.guild.member(message.author.id).voice.channel;

    const players = await Player.find({discordId: {$in: channelVoice.members.toJSON()}});
    let msg = '';
    players.forEach(_ => {
      msg+= `${this.spaceAdd(message.guild.member(_.discordId).displayName)}${this.spaceAdd(_.rating.toFixed(0))}${this.spaceAdd(message.guild.member(_.discordId).roles.cache.find(r => roles.includes(r.name)).name || 'Colono')}`;
    });
    await message.channel.send(msg,{code:'asciidoc'});
  }

  spaceAdd (msg, size) {
    return `${msg}${Array(size)-msg.lenght}`;
  }
}

module.exports = Sala;