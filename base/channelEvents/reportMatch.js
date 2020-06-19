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
    const playerCivRegex = /.*<@!([0-9]*)*?>\s*([A-Z]+)/g;

    const content = message.content.toUpperCase();

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
    let pos = 1;
    while (res = playerCivRegex.exec(content)) { //eslint-disable-line no-cond-assign
      let player = await Player.findOne({discordId: res[1]});

      if (!res[2]) return await this.error(`Informe uma civilização para o jogador <@!${res[1]}>`);


      if (!player) {
        player = new Player();
        player.discordId = res[1];
        player.save();
      }

      match.leaderboard.push({
        position: pos,
        civ: res[2],
        player
      });

      pos++;
    };

    let leaderboardText = '';
    match.leaderboard.forEach(l => {
      leaderboardText += `<@!${l.player.discordId}> | ${l.civ}\n`;
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
}

module.exports = ReportMatch;