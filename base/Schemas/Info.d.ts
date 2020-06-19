import { Document, Model } from 'mongoose';
import player from './Player';

interface Info extends Document {
  key: string;
  value: string;
}

let info: Model<Info>;

export = info;
