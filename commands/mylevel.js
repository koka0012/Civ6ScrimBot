const Command = require("../base/Command.js");

class MyLevel extends Command {
  constructor (client) {
    super(client, {
      name: "minharole",
      description: "Mostra sua permissão atual.",
      usage: "minharole",
      guildOnly: true
    });
  }

  async run (message, args, level) {
    const friendly = this.client.config.permLevels.find(l => l.level === level).name;
    message;
    message.reply(`Seu level de permissão é: ${level} - ${friendly}`);
  }
}

module.exports = MyLevel;
