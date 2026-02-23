import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = Users & Document;

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN_STAFF = 'ADMIN_STAFF',
    CUSTOMER = 'CUSTOMER',
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    IN_ACTIVE = "IN_ACTIVE",
    BLOCK = 'BLOCKED',
}

export enum InvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
}

@Schema({ timestamps: true })
export class Users extends Document {

    @Prop({ type: String, default: UserRole.CUSTOMER, enum: UserRole })
    role: string = UserRole.CUSTOMER;

    @Prop({ default: false })
    super_admin: boolean = false;

    @Prop({ type: String, default: null })
    first_name: string;

    @Prop({ type: String, default: null })
    last_name: string;

    @Prop({ type: String, default: null })
    full_name: string;

    @Prop({ type: String, default: null })
    email: string;

    @Prop({ type: String, default: null, select: false })
    password: string;

    @Prop({ type: String, default: null })
    profile_pic: string;

    @Prop({ type: String, default: null })
    phone_number: String;

    @Prop({ type: String, default: null })
    country_code: string;

    @Prop({ type: String, default: null })
    country: string;

    @Prop({ type: String, default: "INR" })
    currency: string;

    @Prop({ type: String, default: "english" })
    language: string;

    @Prop({
        type: String,
        default: UserStatus.IN_ACTIVE,
        enum: UserStatus,
    })
    status: string;

    @Prop({ type: String, default: null })
    blocked_reason: string;

    @Prop({ type: Boolean, default: false })
    is_email_verify: boolean;

    @Prop({ type: Boolean, default: false })
    is_phone_verify: boolean;

    @Prop({ type: Boolean, default: true })
    is_notification: Boolean;

    @Prop({ type: String, default: "Asia/Kolkata" })
    time_zone: string;

    @Prop({ type: String })
    stripe_customer_id: string;

    @Prop({
        type: String,
        enum: InvitationStatus,
    })
    invitation_status: string;

    @Prop({ type: [String] })
    module_permission?: string[];

    @Prop({ type: Boolean, default: false })
    is_deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(Users);
