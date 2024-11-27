import mongoose from 'mongoose';

export async function setupMongo() {
	try {
		if (mongoose.connection.readyState === 1) {
			return;
		}

		console.log('🎲 Connecting to database...');

		await mongoose.connect('mongodb://127.0.0.1:27017/masters-notes');

		console.log('✅ Database connected.');
	} catch (err) {
		throw new Error('❌ Database not connected.');
	}
}
