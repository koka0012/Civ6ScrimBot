import { Document, Model } from 'mongoose';

interface Player extends Document {
  discordId: string;
  plataform: string;
  rating: number;
  rd: number;
  vol: number;
}

let player: Model<Player>;

export = player;
