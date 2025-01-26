import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
    @Prop({ required: true })
    name: string;

    @Prop()
    profilePicture?: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
    participants: User[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: User;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    admins: User[];
}

export const GroupSchema = SchemaFactory.createForClass(Group); 