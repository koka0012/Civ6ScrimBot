const Command = require('../../base/Command.js');
const Player = require('../../base/Schemas/Player.js');
const moment = require('moment');

class Reset extends Command {
  constructor (client) {
    super(client, {
      name: 'reset',
      description: 'Resetar seu elo',
      usage: 'Resetar seu elo',
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
    const player = await Player.findOne({ discordId: message.author.id });
    const settings = this.client.getSettings(message.guild);

    if (!player) {
      return message.reply('Desculpe, você ainda não está cadastrado no sistema de rank. Utilize `.status` para se cadastrar ou jogue um jogo');
    }

    if (player.resetCount < 1) {
      await message.delete();
      const msg = await message.reply({
        'embed': {
          'title': 'Resetar Rank',
          'description': `<@!${message.author.id}> deseja realmente resetar sua pontuação? Reaja a esta mensagem com :white_check_mark: para confirmar ou com :x: para recusar.\nEssa ação é **irreversível**`,
          'color': 15468812,
          'timestamp': moment().format()
        }
      });

      await msg.react('724756300084281435');
      await msg.react('724755234387394672');
      try {
        const reactions = await msg.awaitReactions((reaction, user) => {
          return (reaction.id == '724756300084281435' || reaction.id == '724756300084281435') && user.id ==message.author.id;
        }, {max: 1, time: 60000, errors: ['time']});

        switch (reactions.first().emoji.id) {
          case '724756300084281435':
            player.rating = settings.defaultRating;
            player.rd = settings.defaultRd;
            player.vol = settings.defaultVol;
            player.resetCount++;
            await player.save();
            return await message.reply('Rank resetado com sucesso.');
          case '724755234387394672':
            return await msg.delete();
        }
      } catch (e) {
        await msg.delete();
      }
      
    }
  }
}

module.exports = Reset;