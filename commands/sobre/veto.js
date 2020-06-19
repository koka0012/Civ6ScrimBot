const Command = require('../../base/Command.js');

class Veto extends Command {
  constructor (client) {
    super(client, {
      name: 'veto',
      description: 'Veto da partida',
      usage: 'veto',
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
    await message.channel.send(`**PLACAR:**
    • Os jogadores em 2° e 3° lugar no placar têm poder de veto
    **CIÊNCIA:**
    • O jogador com a maior quantidade de ciência por turno tem poder e veto
    • O jogador com a maior quantidade de tecnologias pesquisadas tem poder de veto
    • Qualquer jogador que tenha lançado o satélite tem poder de veto
    **CULTURA:**
    • O jogador com a maior quantidade de turistas estrangeiros (no painel de vitória cultural) tem poder de veto
    • Qualquer jogador com pelo menos 500 de turismo por turno tem poder veto
    **MILITAR:**
    • O jogador com maior poder militar (número ao lado da espada) tem poder de veto
    **RELIGIÃO:**
    • Qualquer jogador que tiver convertido pelo menos 30% das civilizações tem poder de veto
    DIPLOMACIA:
    • Qualquer jogador que tiver mais de 10 pontos diplomáticos tem poder de veto`);
  }
}

module.exports = Veto;