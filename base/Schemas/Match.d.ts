import player from './Player';
import { Document, Model } from 'mongoose';

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
    sub?: player | null;
  }[];
}

let match: Model<Match>;

export = match;
