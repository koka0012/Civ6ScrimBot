/**
 * @abstract
 *
 * @class ChannelEvent
 */
class ChannelEvent {
  /**
   * Creates an instance of ChannelEvent.
   * @param {typeof import("../index")} client The discord client
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
   * @memberof ChannelEvent
   */
  constructor (
    client,
    {
      name = null,
    }
  ) {
    this.client = client;
    this.name = name;
  }

  /**
   *
   *  The funcion to run the ChannelEvent
   *
   * @abstract
   * @param {import("discord.js").Message} message
   * @memberof ChannelEvent
   */
  async onMessage (message) {} // eslint-disable-line no-unused-vars
}
module.exports = ChannelEvent;
