const Command = require('../../base/Command.js');

class Conceder extends Command {
  constructor (client) {
    super(client, {
      name: 'conceder',
      description: 'Conceder a partida',
      usage: 'conceder',
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
    await message.channel.send(`\`Turno 0-80  -   Votação Unânime\`
    \`Turno 81-100  -  Todos menos 1\`
    \`Turno 101+      -  Todos menos 2\`
    
    Regras Básicas para Conceder:
    • O jogo deverá ser pausado até o 20 segundo antes do turno terminar
    • O primeiro lugar na posição de pontos não poderá iniciar a votação
    • A pessoa que iniciar a votação automaticamente terá o seu voto a favor do final da partida
    • Cada votação deverá obedecer ao intervalo de dez turnos uma da outra, em caso de outra votação ter falhado
    • Caso dois jogadores decidam por empatar pela mesma posição no placar, os moverão pela mesma posição, ganhando poder de veto
    • Um jogador que decida empatar com outro jogador em uma posição muito acima da sua apenas poderá fazê-lo se todos aqueles entre ambas as posições concordarem
    • Empates pelo primeiro lugar não serão possíveis, a menos que haja aprovação de um administrador
    • Se uma cidade foi capturada neste turno, até os 20 segundos mínimos de encerramento de turno, a votação de conceder deverá ocorrer no turno seguinte
    • Para informações sobre as regras de veto, digite .veto`);
  }
}

module.exports = Conceder;