// Avatar file validations
export function validate_avatar_file(avatar_file: File): { valid: boolean; errors: string[] } {
	let valid = true;
	const errors = [];

	if (!avatar_file) {
		return {
			valid: false,
			errors: ['Avatar file is required']
		};
	}

	if (avatar_file.size > 2000000) {
		valid = false;
		errors.push('Avatar file size must be less than 2MB');
	}

	if (!avatar_file.type.includes('image')) {
		valid = false;
		errors.push('Avatar file must be an image');
	}

	return {
		valid,
		errors
	};
}
