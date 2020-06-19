const Command = require('../../base/Command.js');

class Veto extends Command {
  constructor (client) {
    super(client, {
      name: 'remapear',
      description: 'Voto para remapear',
      usage: 'remapear',
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
    await message.channel.send(`Para pedir por um mapa novo você inicialmente deverá postar no canal #"" uma imagem da sua posição inicial. 

**Cada um por si**
• Cada jogador apenas poderá pedir por um mapa novo durante ou antes do turno 10. Para isso, pelo menos 66% dos jogadores deverão votar favoravelmente
• Apenas um máximo de dois jogadores poderão requisitar a votação por partida
    
**Times**
• Ambos os times têm direito a um mapa novo até o turno 10 caso a votação seja aprovada pela maioria dos integrantes da própria equipe
    
**Observações**
• Em partidas em que todos os jogadores optarem por civilizações aleatórias, se um mapa novo for concedido, os jogadores deverão optar novamente por civilizações aleatórias a menos que seja aprovada uma votação pela maioria dos jogadores
• Em caso de bugs ou crashes em que seja feito necessário uma mapa novo, se esse for o terceiro remapeamento os jogadores não precisarão continuar na partida, sem penalidades
• Um mapa novo deverá ser garantido automaticamente se dois jogadores tiverem enquanto posição inicial de seus colonos uma distância mínima inferior a 9 painéis (sem que os tenham movido) - ou inferior a 6 painéis em caso de cidades-estado. Uma imagem será necessária para comprovar`);
  }
}

module.exports = Veto;