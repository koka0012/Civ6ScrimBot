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
    const membersId = channelVoice.members.map(_ => _.id);

    const players = await Player.find({discordId: {$in: membersId}});
    let msg = '';
    players.forEach(_ => {
      membersId.slice(membersId.indexOf(_.id), 1);
      msg+= `${this.spaceAdd(message.guild.members.cache.get(_.discordId).displayName, 30)}${this.spaceAdd(_.rating.toFixed(0), 10)}${message.guild.members.cache.get(_.discordId).roles.cache.find(r => roles.includes(r.name)).name || 'Colono'}\n`;
    });

    const settings = this.client.getSettings(message.guild);

    if (membersId.length > 0) {
      membersId.forEach(_ => {
        msg+= `${this.spaceAdd(message.guild.members.cache.get(_).displayName, 30)}${this.spaceAdd(settings.defaultRating, 10)}${message.guild.members.cache.get(_).roles.cache.find(r => roles.includes(r.name)).name || 'Colono'}\n`;
      });
    }

    await message.channel.send(msg,{code:'asciidoc'});
  }

  spaceAdd (msg, size) {
    return `${msg}${Array(size-msg.length).join(' ')}`;
  }
}

module.exports = Sala;