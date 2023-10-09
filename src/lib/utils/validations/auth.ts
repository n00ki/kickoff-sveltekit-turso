import { z } from 'zod';

// Registration Form Validation
export const registration_schema = z.object({
	email: z
		.string({ required_error: 'Email is required.' })
		.trim()
		.min(1, { message: 'Email is required.' })
		.max(64, { message: 'Email must be less than 64 characters.' })
		.email({ message: 'Email is invalid.' }),
	password: z
		.string({ required_error: 'Password is required.' })
		.trim()
		.min(6, { message: 'Password must be at least 6 characters.' })
		.max(64, { message: 'Password must be less than 32 characters.' }),

	password_confirmation: z
		.string({ required_error: 'Password confirmation is required.' })
		.trim()
		.min(1, { message: 'Password confirmation is required.' })
});

// Login Form Validation
export const login_schema = z.object({
	email: z
		.string({ required_error: 'Email is required.' })
		.trim()
		.min(1, { message: 'Email is required.' })
		.max(64, { message: 'Email must be less than 64 characters.' })
		.email({ message: 'Email is invalid.' }),
	password: z
		.string({ required_error: 'Password is required.' })
		.trim()
		.min(1, { message: 'Password is required.' })
});

// Request Password Reset Form Validation
export const request_password_reset_schema = z.object({
	email: z
		.string({ required_error: 'Email is required.' })
		.trim()
		.min(1, { message: 'Email is required.' })
});

// Reset Password Form Validation
export const reset_password_schema = z.object({
	email: z
		.string({ required_error: 'Email is required.' })
		.trim()
		.email({ message: 'Email is invalid.' }),
	token: z
		.string({ required_error: 'Token is required.' })
		.trim()
		.min(1, { message: 'Token is required.' }),
	password: z
		.string({ required_error: 'Password is required.' })
		.trim()
		.min(6, { message: 'Password must be at least 6 characters.' })
		.max(64, { message: 'Password must be less than 32 characters.' }),

	password_confirmation: z
		.string({ required_error: 'Password confirmation is required.' })
		.trim()
		.min(1, { message: 'Password confirmation is required.' })
});

export const edit_account_validation_schema = z.object({
	avatar: z.string().optional()
});
