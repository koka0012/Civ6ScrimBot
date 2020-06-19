// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
const Command = require('../base/Command.js');

class SetCMD extends Command {
  constructor (client) {
    super(client, {
      name: 'set',
      description: 'Veja ou altere configurações para seu servidor.',
      category: 'Sistema',
      usage: 'set <view/get/edit> <key> <value>',
      guildOnly: true,
      aliases: ['setting', 'settings'],
      permLevel: 'Administrator'
    });
  }

  async run (message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars

    // First we need to retrieve current guild settings
    const settings = message.settings;
    const defaults = this.client.settings.get('default');
    const overrides = this.client.settings.get(message.guild.id);
    if (!this.client.settings.has(message.guild.id)) this.client.settings.set(message.guild.id, {});
  
    // Secondly, if a user does `-set edit <key> <new value>`, let's change it
    if (action === 'edit') {
      // User must specify a key.
      if (!key) return message.reply('Por favor, específique uma chave para editar.');
      // User must specify a key that actually exists!
      if (!settings[key]) return message.reply('Essa chave não existe nas configurações.');
      // Cannot edit objects direclty
      if (typeof settings[key] === 'object') return message.reply('Essa chave não pode ser editada diretamente.');
      // User must specify a value to change.
      const joinedValue = value.join(' ');
      if (joinedValue.length < 1) return message.reply('Por favor específique um valor.');
      // User must specify a different value than the current one.
      if (joinedValue === settings[key]) return message.reply('Essa chave já possui esse valor.');

      // If the guild does not have any overrides, initialize it.
      if (!this.client.settings.has(message.guild.id)) this.client.settings.set(message.guild.id, {});

      // Modify the guild overrides directly.
      this.client.settings.set(message.guild.id, joinedValue, key);
      message.reply(`Chave ${key} alterada com sucesso para o valor ${joinedValue}`);
    } else
  
    // If a user does `-set del <key>`, let's ask the user if they're sure...
    if (action === 'del' || action === 'reset') {
      if (!key) return message.reply('Específique a chave para deletar (resetar).');
      if (!settings[key]) return message.reply('Essa chave não existe nas configurações.');
      if (!overrides[key]) return message.reply('Essa chave não foi sobrescrita e já está usando o valor padrão.');

      // Throw the 'are you sure?' text at them.
      const response = await this.client.awaitReply(message, `Tem certeza que quer resetar a chave \`${key}\` para o valor padrão \`${defaults[key]}\`?`);

      // If they respond with y or yes, continue.
      if (['y', 'yes', 's', 'sim'].includes(response)) {

        // We reset the `key` here.
        this.client.settings.delete(message.guild.id, key);
        message.reply(`${key} foi resetada para o padrão.`);
      } else

      // If they respond with n or no, we inform them that the action has been cancelled.
      if (['n','no','cancel', 'cancelar', 'nao', 'não'].includes(response)) {
        message.reply(`A chave \`${key}\` permaneceu com o valor \`${settings[key]}\``);
      }
    } else
  
    // Using `-set get <key>` we simply return the current value for the guild.
    if (action === 'get') {
      if (!key) return message.reply('Por favor, específique o valor para vizualizar.');
      if (!settings[key]) return message.reply('Essa chave não existe.');

      let value = settings[key];
      if (typeof value === 'object') {
        value = JSON.stringify(value, '', 2);
      }

      message.reply(`O valor da chave ${key} atualmente é ${value}`);
      
    } else if (action === 'add') {
      if (!key) return message.reply('Por favor, específique o valor para modificar.');
      if (!settings[key]) return message.reply('Essa chave não existe.');
      if (typeof settings[key] !== 'object') return message.reply('Essa chave não pode ser editada por este comando.');

      if (!this.client.settings.has(message.guild.id)) this.client.settings.set(message.guild.id, {});

      const index = value.shift();

      // Modify the guild overrides directly.
      this.client.settings.set(message.guild.id, {...settings[key], [index]: value.join(' ') }, key);
      message.reply(`Chave ${key} alterada com sucesso, adicionado a index ${index} com o valor ${value.join(' ')}`);

    } else {
      // Otherwise, the default action is to return the whole configuration;
      const array = Object.entries(settings).map(([key, value]) =>`${key}${' '.repeat(20 - key.length)}::  ${ typeof value !== 'object' ? value : 'Use get para ver esse valor.'}`);
      await message.channel.send(`= Configuração Atuais da Guild =\n${array.join('\n')}`, {code: 'asciidoc'});
    }
  }
}

module.exports = SetCMD;