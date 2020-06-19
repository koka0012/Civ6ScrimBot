import { Message } from 'discord.js';

abstract class ChannelEvent {
  abstract async onMessage(message: Message): Promise<void> {}
}

export = ChannelEvent;
