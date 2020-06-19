const ChannelEvent = require('../ChannelEvent.js');

/**
 * @class Pong
 * @extends {ChannelEvent}
 */
class Pong extends ChannelEvent {
  constructor (client) {
    super(client, {name: 'pong'});
  }
  /**
   * 
   * @param {import("discord.js").Message} message 
   */
  async onMessage (message) {
    message.reply(message.content);
  }
}

module.exports = Pong;