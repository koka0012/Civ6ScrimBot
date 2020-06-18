import { Document, Model } from 'mongoose';

interface Player extends Document {
  discordId: string;
  plataform: string;
}

let player: Model<Player>;

export = player;
