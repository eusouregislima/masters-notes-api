import { Schema, Types } from 'mongoose';

export const ArticleAuthorSchema = new Schema(
	{
		_id: Types.ObjectId,
		name: String,
		fullName: String,
	},
	{ timestamps: false, versionKey: false, _id: false },
);
