const Command = require('../base/Command.js');

class Reboot extends Command {
  constructor (client) {
    super(client, {
      name: 'reboot',
      description: 'Se estiver rodando sobre PM2, o bot vai reiniciar.',
      category: 'Sistema',
      usage: 'reboot',
      permLevel: 'Bot Owner',
      aliases: []
    });
  }

  async run (message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.reply('Bot is shutting down.');
      await Promise.all(this.client.commands.map(cmd => this.client.unloadCommand(cmd)));
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;
