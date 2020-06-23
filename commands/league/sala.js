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
      msg+= `${this.spaceAdd(message.guild.member(_.discordId).displayName, 30)}${this.spaceAdd(_.rating.toFixed(0), 10)}${message.guild.member(_.discordId).roles.cache.find(r => roles.includes(r.name)).name || 'Colono'}\n`;
    });

    const settings = this.client.getSettings(message.guild);

    const filteredMembersId = membersId.filter(_ => !players.find(x => x.discordId == _));

    if (filteredMembersId.length > 0) {
      filteredMembersId.forEach(_ => {
        msg+= `${this.spaceAdd(message.guild.member(_).displayName, 30)}${this.spaceAdd(settings.defaultRating.toString(), 10)}${message.guild.member(_).roles.cache.find(r => roles.includes(r.name)).name || 'Colono'}\n`;
      });
    }

    await message.channel.send(msg,{code:'asciidoc'});
  }

  spaceAdd (msg, size) {
    return `${msg}${Array(size-msg.length).join(' ')}`;
  }
}

module.exports = Sala;