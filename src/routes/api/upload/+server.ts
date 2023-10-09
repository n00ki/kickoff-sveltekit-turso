// Env Variables
import { PUBLIC_AWS_S3_BUCKET_NAME } from '$env/static/public';

// Utils
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { s3 } from '$lib/server/storage';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { file_type, destination_directory } = await request.json();

		const file_name = crypto.randomBytes(16).toString('hex');

		const file_params = {
			Bucket: PUBLIC_AWS_S3_BUCKET_NAME,
			Key: `${destination_directory}/${file_name}`,
			ContentType: file_type
		};

		const command = new PutObjectCommand(file_params);
		const url = await getSignedUrl(s3, command, { expiresIn: 60000 });

		return json({
			presigned_url: url,
			file_name
		});
	} catch (err) {
		console.log(err);
	}

	throw error(500, 'Something went wrong');
};
