import { Document, Model } from 'mongoose';

export interface PlayerModel extends Document {
  discordId: string;
  plataform: string;
  rating: number;
  rd: number;
  vol: number;
  resetCount: number;
}

let player: Model<PlayerModel>;

export = player;
