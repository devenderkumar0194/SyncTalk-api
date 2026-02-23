import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import * as Model from './index'

export enum DeviceTypes {
    NULL = null,
    IOS = 'IOS',
    ANDROID = 'ANDROID',
    WEB = 'WEB',
}

@Schema({ timestamps: true })
export class Sessions extends Document {

    @Prop({ type: Types.ObjectId, ref: Model.User.Users.name, default: null })
    user: Types.ObjectId = null

    @Prop({ type: String, default: null })
    scope: string

    @Prop({ type: String, default: null })
    access_token: string = null;

    @Prop({ default: DeviceTypes.NULL, enum: DeviceTypes })
    device_type: string;

    @Prop({ type: String, default: null })
    fcm_token: string = null;

    @Prop({ type: String, default: null })
    client_ip: string = null;

    @Prop({ type: Boolean, default: false })
    is_logout: boolean = false;
}

export const SessionSchema = SchemaFactory.createForClass(Sessions);  
