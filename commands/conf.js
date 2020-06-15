/*
FOR GUILD SETTINGS SEE set.js !
This command is used to modify the bot's default configuration values, which affects all guilds. 
If a default setting is not specifically overwritten by a guild, changing a default here will
change it for that guild. The `add` action adds a key to the configuration of every guild in
your bot. The `del` action removes the key also from every guild, and loses its value forever.
*/
const Command = require('../base/Command.js');

class Conf extends Command {
  constructor (client) {
    super(client, {
      name: 'conf',
      description: 'Modifica as configurações padrões para todas as guilds.',
      category: 'Sistema',
      usage: 'conf <view/get/edit> <key> <value>',
      guildOnly: true,
      aliases: ['defaults'],
      permLevel: 'Bot Admin'
    });
  }

  async run (message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars
    
    // Retrieve Default Values from the default settings in the bot.
    const defaults = this.client.settings.get('default');
  
    // Adding a new key adds it to every guild (it will be visible to all of them)
    if (action === 'add') {
      if (!key) return message.reply('Especifique uma chave para alterar');
      if (defaults[key]) return message.reply('Essa chave já existe nas chaves padrões');
      if (value.length < 1) return message.reply('Adicione um valor');

      // `value` being an array, we need to join it first.
      defaults[key] = value.join(' ');
  
      // One the settings is modified, we write it back to the collection
      this.client.settings.set('default', defaults);
      message.reply(`Chave ${key} foi adicionada com o valor ${value.join(' ')}`);
    } else
  
    // Changing the default value of a key only modified it for guilds that did not change it to another value.
    if (action === 'edit') {
      if (!key) return message.reply('Especifique uma chave para alterar');
      if (!defaults[key]) return message.reply('Essa chave não existe');
      if (value.length < 1) return message.reply('Especifique um valor');

      defaults[key] = value.join(' ');

      this.client.settings.set('default', defaults);
      message.reply(`Chave ${key} alterada para ${value.join(' ')}`);
    } else
  
    // WARNING: DELETING A KEY FROM THE DEFAULTS ALSO REMOVES IT FROM EVERY GUILD
    // MAKE SURE THAT KEY IS REALLY NO LONGER NEEDED!
    if (action === 'del') {
      if (!key) return message.reply('Especifique a chave para deletar.');
      if (!defaults[key]) return message.reply('Essa chave não existe nas configurações');
    
      // Throw the 'are you sure?' text at them.
      const response = await this.client.awaitReply(message, `Tem certeza que quer deletar a chave ${key} de todas as guilds?  **NÃO**  pode ser desfeito.`);

      // If they respond with y or yes, continue.
      if (['y', 'yes', 's', 'sim'].includes(response)) {

        // We delete the default `key` here.
        delete defaults[key];
        this.client.settings.set('default', defaults);
      
        // then we loop on all the guilds and remove this key if it exists.
        // "if it exists" is done with the filter (if the key is present and it's not the default config!)
        for (const [guildid, conf] of this.client.settings.filter((setting, id) => setting[key] && id !== 'default')) {
          delete conf[key];
          this.client.settings.set(guildid, conf);
        }
      
        message.reply(`Chave ${key} foi deletada.`);
      } else
      // If they respond with n or no, we inform them that the action has been cancelled.
      if (['n','no','cancel', 'nao', 'não', 'cancelar'].includes(response)) {
        message.reply('Ação cancelada.');
      }
    } else
  
    // Display a key's default value
    if (action === 'get') {
      if (!key) return message.reply('Especifique a chave');
      if (!defaults[key]) return message.reply('Essa chave não existe');
      message.reply(`O valor da chave ${key} atualemte é ${defaults[key]}`);

      // Display all default settings.
    } else {
      const array = [];
      Object.entries(this.client.settings.get('default')).forEach(([key, value]) => {
        array.push(`${key}${' '.repeat(20 - key.length)}::  ${value}`); 
      });
      await message.channel.send(`= Configuração padrão do Bot =
${array.join('\n')}`, {code: 'asciidoc'});    }
  }
}

module.exports = Conf;
