import { Document, Model } from 'mongoose';
import player from './Player';

interface Match extends Document {
  type: string;
  host: string;
  verified: boolean;
  messageId: string;
  messageChannelId: string;
  leaderboard: {
    position: number;
    civ: string;
    player: player;
  }[];
}

let match: Model<Match>;

export = match;
