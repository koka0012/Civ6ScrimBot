const ChannelEvent = require('../ChannelEvent.js');
const Player = require('../Schemas/Player.js');
const Match = require('../Schemas/Match.js');
const moment = require('moment');

/**
 * @class ReportMatch
 * @extends {ChannelEvent}
 */
class ReportMatch extends ChannelEvent {
  constructor (client) {
    super(client, {name: 'reportmatch'});
  }
  /**
   * 
   * @param {import("discord.js").Message} message 
   */
  async onMessage (message) {
    const gameTypeRegex = /TIPO DE JOGO:\s*(FFA|TIME)/g;
    const hostRegex = /HOST: <@!([0-9]*)*?>/g;
    const playerCivRegex = /<@!([0-9]*)*?>\s*([A-Z]+)(\sSUB\s<@!([0-9]*)>)?/g;

    const lines = message.content.split('\n').filter(_ => _ != '');
    const content = lines.join('\n').toUpperCase();

    // GAME TYPE
    const gameTypeMatch = gameTypeRegex.exec(content);
    if (!gameTypeMatch || gameTypeMatch.length < 1) {
      return await this.error('Modo de jogo inválido. Adicione a lina `TIPO DE JOGO: FFA/TIME` para definir.', message);
    }
    const gameType = gameTypeMatch[1];

    // HOST
    const hostMatch = hostRegex.exec(content);
    if (!hostMatch || hostMatch.length < 1) {
      return await this.error('Host não encontrado. Adicione a linha `HOST: @NOME_DO_JOGADOR` para definir.', message);
    }
    const host = hostMatch[1];

    const match = new Match();
    match.host = host;
    match.type = gameType;
    match.leaderboard = [];

    let res;
    while (res = playerCivRegex.exec(content)) { //eslint-disable-line no-cond-assign
      let player = await Player.findOne({discordId: res[1].replace('!', '').replace('<', '').replace('>', '').replace('@', '')});

      if (!res[2]) return await this.error(`Informe uma civilização para o jogador <@!${res[1]}>`);

      const pos = this.lineNumberByIndex(res.index, content) - 2;

      if (!player) {
        const settings = this.client.getSettings(message.guild);
        player = new Player();
        player.discordId = res[1].replace('!', '').replace('<', '').replace('>', '').replace('@', '');
        player.rating = settings.defaultRating;
        player.rd = settings.defaultRd;
        player.vol = settings.defaultVol;
        player.save();
      }

      let sub;

      if (res[4]) {
        let player = await Player.findOne({discordId: res[4].replace('!', '').replace('<', '').replace('>', '').replace('@', '')});

        if (!player) {
          const settings = this.client.getSettings(message.guild);
          player = new Player();
          player.discordId = res[4].replace('!', '').replace('<', '').replace('>', '').replace('@', '');
          player.rating = settings.defaultRating;
          player.rd = settings.defaultRd;
          player.vol = settings.defaultVol;
          player.save();
        }

        sub = player;
        console.log(sub);
      }

      match.leaderboard.push({
        position: pos,
        civ: res[2],
        player,
        sub
      });
    };

    let leaderboardText = '';
    match.leaderboard.forEach(l => {
      leaderboardText += `${l.position}. <@!${l.player.discordId}> | ${l.civ} ${l.sub ? `- SUBSTITUIDO POR <@!${l.sub.discordId}>` : ''}\n`;
    });

    const reply = {
      'embed': 
        {
          'title': 'Reporte de partida',
          'color': 10624443,
          'fields': [
            {
              'name': 'Modo de Jogo',
              'value': gameType
            },
            {
              'name': 'Host',
              'value': `<@!${host}>`
            },
            {
              'name': 'Placar',
              'value': leaderboardText
            }
          ],
          'footer': {
            'text': match.id
          },
          'timestamp': moment().format()
        }
      
    };

    message.delete();
    await message.channel.send(reply);

    await match.save();
    
  }

  async error (text, msg) {
    const res = await msg.reply(text);
    await msg.delete({timeout: 10000});
    res.delete({timeout: 10000});
  }

  lineNumberByIndex (index,string) {
    // RegExp
    var line = 0,
      match,
      re = /(^)[\S\s]/gm;
    while (match = re.exec(string)) {
      if (match.index > index)
        break;
      line++;
    }
    return line;
  }
}

module.exports = ReportMatch;