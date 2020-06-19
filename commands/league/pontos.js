const Command = require('../../base/Command.js');
const Player = require('../../base/Schemas/Player.js');
const moment = require('moment');

class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'pontos',
      description: 'Consultar seus pontos ou de um jogador.',
      usage: 'pontos <jogador>',
      category: 'Liga',
      aliases: ['p', 'status', 's'],
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
  async run (message, args) {
    const playerId = message.guild.members.resolve(args[0] && args[0].replace('<', '').replace('@', '').replace('!', '').replace('>', '') || message.author.id);

    const settings = this.client.getSettings(message.guild);

    let player = await Player.findOne({discordId: playerId.id});
    if (!player) {
      player = new Player();
      player.discordId = playerId;
      player.rating = settings.defaultRating;
      player.rd = settings.defaultRd;
      player.vol = settings.defaultVol;
      player.save();
    }

    const embed = {
      'embed':
        {
          'title': playerId.displayName,
          'color': 2470302,
          'fields': [
            {
              'name': 'Pontos de liga',
              'value': player.rating | 0
            }
          ],
          'thumbnail': {
            'url': playerId.user.avatarURL()
          },
          'timestamp': moment().format()
        }
    };

    await message.channel.send(embed);
  }
}

module.exports = Ping;
