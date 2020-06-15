const Command = require('../base/Command.js');

class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      description: 'Latência e tempo de resposta da API.',
      usage: 'ping',
      aliases: ['pong'],
      permLevel: 'Bot Admin',
    });
  }

  /**
   * @override
   */
  async run (message, args, level) {
    // eslint-disable-line no-unused-vars
    super.run(message, args, level);
    try {
      const msg = await message.channel.send('🏓 Ping!');
      msg.edit(
        `🏓 Pong! (Roundtrip took: ${
          msg.createdTimestamp - message.createdTimestamp
        }ms. 💙: ${Math.round(this.client.ws.ping)}ms.)`
      );
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Ping;
