/**
 * @abstract
 *
 * @class Command
 */
class Command {
  /**
   * Creates an instance of Command.
   * @param {import("discord.js").Client} client The discord client
   * @param {{name: string  | null, description: string, category: string, usage: string, enabled: boolean, guildOnly: boolean, aliases: Array<string>, permLevel: string}} {
   *     name = null,
   *     description = "No description provided.",
   *     category = "Miscellaneous",
   *     usage = "No usage provided.",
   *     enabled = true,
   *     guildOnly = false,
   *     aliases = new Array(),
   *     permLevel = "User"
   *   }
   * @memberof Command
   */
  constructor (
    client,
    {
      name = null,
      description = 'No description provided.',
      category = 'Miscellaneous',
      usage = 'No usage provided.',
      enabled = true,
      guildOnly = false,
      aliases = new Array(),
      permLevel = 'User',
    }
  ) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, permLevel };
    this.help = { name, description, category, usage };
  }

  /**
   * @abstract
   *
   *  The funcion to run the command
   *
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @param {number} level
   * @memberof Command
   */
  async run (message, args, level) {} // eslint-disable-line no-unused-vars
}
module.exports = Command;
