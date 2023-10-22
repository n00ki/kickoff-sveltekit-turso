import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';

const config = {
    plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "noam-shemesh",
            project: "kickoff-sveltekit-turso"
        }
    }), sveltekit()],

    test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;