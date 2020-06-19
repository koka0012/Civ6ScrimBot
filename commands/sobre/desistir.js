const Command = require('../../base/Command.js');

class Desistir extends Command {
  constructor (client) {
    super(client, {
      name: 'desistir',
      description: 'Desistir da partida',
      usage: 'desistir',
      category: 'Liga',
    });
  }

  /**
   * @overridew
   *
   *  The funcion to run the command
   *
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @param {number} level
   * @memberof Command
   */
  async run (message) {
    await message.channel.send('Você poderá desistir do jogo a qualquer momento, podendo sair da partida sem penalidades conquanto tenha perdido 2/3 de suas cidades. Do contrário, poderá pedir por uma votação a partir do turno 50, devendo obter uma quantidade de votos igual a 2/3 da quantidade total de participantes. Contudo, para essa votação, os três primeiros jogadores no placar de pontuação poderão vetá-la, fazendo-a falhar automaticamente.');
  }
}

module.exports = Desistir;