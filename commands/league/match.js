const Command = require('../../base/Command.js');
const Player = require('../../base/Schemas/Player.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Match = require('../../base/Schemas/Match.js');
const player = require('../../base/Schemas/Player.js');

class Register extends Command {
  constructor (client) {
    super(client, {
      name: 'confirmar',
      description: 'Confirmar partida na LBC',
      usage: 'confirmar <código da partida>',
      category: 'Liga',
      aliases: ['confirm', 'c'],
      permLevel: 'Aprovador'
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
    if (!args[0]) return message.reply('É necessário informar o código da partida.');
    if (message.channel.type != 'text') return message.reply('É necessário usar esse comando em um servidor.');

    const settings = this.client.getSettings(message.guild);
    const match = await Match.findById(args[0]).populate('leaderboard.player').exec();

    if (match.verified) return message.reply('Partida já foi validada.');

    const rankingPlayers = [];
    const matchGlickoPositions = [];

    match.leaderboard.forEach(m => {
      if (!m.player.rating || !m.player.rd || !m.player.vol) {
        m.player.rating = settings.defaultRating;
        m.player.rd = settings.defaultRd;
        m.player.vol = settings.defaultVol;
      };

      const player = this.client.glicko.makePlayer(m.player.rating, m.player.rd, m.player.vol);
      player.playerDb = m.player;
      rankingPlayers.push(player);
      matchGlickoPositions.push([player]);
    });

    const race = this.client.glicko.makeRace(matchGlickoPositions);
    this.client.glicko.updateRatings(race);

    for (const p of rankingPlayers) {
      const {playerDb: player} = p;
      player.rating = p.getRating();
      player.rd = p.getRd();
      player.vol = p.getVol();

      await player.save();
    }

    match.verified = true;
    await match.save();
    await message.reply(`Partida \`${match.id}\` foi validada. Pontos de liga já foram atualizados.`);
  }
}

module.exports = Register;