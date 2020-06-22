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

    if (player.resetCount === undefined || player.resetCount === null) {
      player.resetCount = 0;
    }

    if (player.resetCount < 1) {
      await message.delete();
      const msg = await message.reply({
        'embed': {
          'title': 'Resetar Rank',
          'description': `<@!${message.author.id}> deseja realmente resetar sua pontuação? Reaja a esta mensagem com ✅ para confirmar ou com ❌ para recusar.\nEssa ação é **irreversível**`,
          'color': 15468812,
          'timestamp': moment().format()
        }
      });

      await msg.react('✅');
      await msg.react('❌');
      try {
        const reactions = await msg.awaitReactions((reaction, user) => {
          return (reaction.name == '✅' || reaction.name == '❌') && user.id ==message.author.id;
        }, {max: 1, time: 60000, errors: ['time']});

        switch (reactions.first().emoji.name) {
          case '✅':
            player.rating = settings.defaultRating;
            player.rd = settings.defaultRd;
            player.vol = settings.defaultVol;
            player.resetCount++;
            await player.save();
            return await message.reply('Rank resetado com sucesso.');
          case '❌':
            return await msg.delete();
        }
      } catch (e) {
        await msg.delete();
      }
      
    } else {
      message.reply('Você atingiu o numero máximo de resets nessa season.');
    }
  }
}

module.exports = Reset;