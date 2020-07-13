const Command = require('../../base/Command.js');
const Match = require('../../base/Schemas/Match.js');
const moment = require('moment');

class Confirm extends Command {
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

      let pRating = m.player.rating;
      let pRd = m.player.rd;
      let pVol = m.player.vol;

      if (m.sub) {
        if (!m.sub.rating || !m.sub.rd || !m.sub.vol) {
          m.sub.rating = settings.defaultRating;
          m.sub.rd = settings.defaultRd;
          m.sub.vol = settings.defaultVol;
        };

        pRating = (pRating + m.sub.rating)/2;
        pRd = (pRd + m.sub.rd)/2;
        pVol = (pVol + m.sub.vol)/2;
      }
      
      const player = this.client.glicko.makePlayer(pRating, pRd, pVol);
      player.playerDb = m.player;
      player.position = m.position;
      player.sub = m.sub;

      rankingPlayers.push(player);

      if (matchGlickoPositions[m.position -1]) {
        matchGlickoPositions[m.position -1] = [...matchGlickoPositions[m.position -1], player];
      } else {
        matchGlickoPositions.push([player]);
      }
    });

    const race = this.client.glicko.makeRace(matchGlickoPositions);
    this.client.glicko.updateRatings(race);

    for (const p of rankingPlayers) {
      const {playerDb: player, position, sub} = p;
      const oldRating = player.rating;

      if (sub) {
        const dRating = p.getRating() - oldRating;
        const oRating  =sub.rating;

        if (dRating <= 0) {
          sub.rating = sub.rating + 20;
          player.rating = p.getRating();
        } else {
          sub.rating = p.getRating();
        }

        this.updateRank(sub, message, oRating);
      } else {
        player.rating = p.getRating();
      }



      player.rd = p.getRd();
      player.vol = p.getVol();

      this.updateRank(player, message, oldRating);

      await player.save();
    }

    match.verified = true;
    await match.save();
    await message.reply(`Partida \`${match.id}\` foi validada. Pontos de liga já foram atualizados.`);
  }

  /**
   * @param {import("../../base/Schemas/Player").PlayerModel} player
   * @param {import("discord.js").Message} message
   * @memberof Confirm
   */
  async updateRank (player, message, oldRating) {
    try {

      if (!message) return;
      const roles = ['Colono', 'Chefe', 'Senhor da Guerra', 'Príncipe', 'Rei', 'Imperador', 'Imortal', 'Divindade'];

      const guild = message.guild;

      const member = await message.guild.members.fetch(`${player.discordId}`);
      if (!member) return;

      const targetRank = Math.floor(Math.max(0, player.rating - 1000) / 200);
      const roleRank = member.roles.cache.find(r => roles.includes(r.name));
      const targetRole = guild.roles.cache.find(r => r.name === roles[targetRank]);

      if (roleRank && roles[targetRank] && roleRank.name != roles[targetRank]) {
        await member.roles.remove(roleRank);
        await member.roles.add(targetRole);

        const embed = {
          'embed':
          {
            'title': 'Promoção na liga!',
            'color': 2470302,
            'fields': [
              {
                'name': 'Jogador',
                'value': `<@!${member.id}>` 
              },
              {
                'name': 'Novo Rank',
                'value': roles[targetRank]
              },{'name': 'Pontos anteriores', value: oldRating.toFixed(0)},
              {
                'name': 'Pontos atuais',
                'value': player.rating.toFixed(0)
              },
              {'name': 'Variação', value: (player.rating - oldRating).toFixed(0)},
            ],
            'thumbnail': {
              'url': member.user.avatarURL() || ''
            },
            'timestamp': moment().format()
          }
        };
  

        guild.channels.cache.get('724042017675673600').send(embed);
      } else if (!roleRank) {
        await member.roles.add(targetRole);
        const embed = {
          'embed':
          {
            'title': 'Atualização de pontos',
            'color': 2470302,
            'fields': [
              {
                'name': 'Jogador',
                'value': `<@!${member.id}>` 
              },{'name': 'Pontos anteriores', value: oldRating.toFixed(0)},
              {
                'name': 'Pontos atuais',
                'value': player.rating.toFixed(0)
              },
              {'name': 'Variação', value: (player.rating - oldRating).toFixed(0)},
            ],
            'thumbnail': {
              'url': member.user.avatarURL() || ''
            },
            'timestamp': moment().format()
          }
        };
  

        guild.channels.cache.get('724042017675673600').send(embed);
      } else {
        const embed = {
          'embed':
        {
          'title': 'Atualização de pontos',
          'color': 2470302,
          'fields': [
            {
              'name': 'Jogador',
              'value': `<@!${member.id}>` 
            },{'name': 'Pontos anteriores', value: oldRating.toFixed(0)},
            {
              'name': 'Pontos atuais',
              'value': player.rating.toFixed(0)
            },
            {'name': 'Variação', value: (player.rating - oldRating).toFixed(0)},
          ],
          'thumbnail': {
            'url': member.user.avatarURL() || ''
          },
          'timestamp': moment().format()
        }
        };
  
        guild.channels.cache.get('724042017675673600').send(embed);
      };
    } catch (err) {
      console.error(err);
    }

  }
}

module.exports = Confirm;