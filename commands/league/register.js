const Command = require('../../base/Command.js');
const Player = require('../../base/Schemas/Player.js');
const { MessageEmbed } = require('discord.js-selfbot');
const moment = require('moment');

class Register extends Command {
  constructor (client) {
    super(client, {
      name: 'registrar',
      description: 'Registrar na liga LBC',
      category: 'Liga',
      aliases: ['reg'],
    });
  }

  /**
   * @override
   *
   *  The funcion to run the command
   *
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @param {number} level
   * @memberof Command
   */
  async run (message, args, level) {
    console.log(await message.author.fetch());
    let player = await Player.findOne({discordId: message.author.id});

    if (player != null) {
      const embed = {
        'description': 'Usuário já cadastrado.',
        'color': 14168397,
        'timestamp': moment().format(),
        'footer': {
          'text': 'LBC'
        },
        'thumbnail': {
          'url': message.author.avatarURL()
        },
        'author': {
          'name': message.author.username,
          'icon_url': message.author.avatarURL()
        }
      };
      await message.channel.send({embed});
      return;
    }

    const dmChannel = await message.author.createDM();

    player = new Player;
    player.discordId = message.author.id;
    await dmChannel.send('\u200bJoga pela steam ou pela epic?',{code:'asciidoc', split: { char: '\u200b' }});
    try {
      const answers = await dmChannel.awaitMessages(m => m.author.id === message.author.id && ['epic', 'steam'].includes(m.content.toLowerCase()), {
        max: 1,
        time: 10000,
        errors: ['time']
      });

      const answer = answers.first();
      player.plataform = answer;

    } catch (err) {
      const embed = {
        'description': 'Demorou muito para responder, tente novamente.',
        'color': 14168397,
        'timestamp': moment().format(),
        'footer': {
          'text': 'LBC'
        },
        'thumbnail': {
          'url': message.author.avatarURL()
        },
        'author': {
          'name': message.author.username,
          'icon_url': message.author.avatarURL()
        }
      };
      await dmChannel.send({embed});
      return;
    }

    player.save();


    const embed = {
      'description': 'Usuário cadastrado com sucesso!.',
      'color': 3787027,
      'timestamp': moment().format(),
      'footer': {
        'text': 'LBC'
      },
      'thumbnail': {
        'url': message.author.avatarURL()
      },
      'author': {
        'name': message.author.username,
        'icon_url': message.author.avatarURL()
      }
    };
    await message.channel.send({ embed });

  }
}

module.exports = Register;