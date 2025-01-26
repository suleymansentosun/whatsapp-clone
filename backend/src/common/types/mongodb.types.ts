import { Document, Types } from 'mongoose';

export type MongooseID = Types.ObjectId;
export interface MongooseDoc extends Document {
    _id: MongooseID;
    createdAt: Date;
    updatedAt: Date;
} 