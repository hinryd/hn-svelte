/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Error {
			frame?: string;
		}
	}
}

type Item = {
	domain?: string;
	id: string;
	url: string;
	title: string;
	type: string;
	time_ago: string;
	points: number;
	user: string;
	comments_count: number;
};
