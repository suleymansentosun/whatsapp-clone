import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    phoneNumber: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: null })
    profilePicture?: string;

    @Prop({ default: "Hey there! I'm using WhatsApp" })
    status?: string;

    @Prop({ default: Date.now })
    lastSeen: Date;

    @Prop({ default: false })
    isOnline: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User); 