import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, url, fetch }) => {
	const itemId = url.searchParams.get('item');
	const list = params.list === 'top' ? 'news' : params.list === 'new' ? 'newest' : params.list;

	const items: Item[] = await fetch(`https://api.hnpwa.com/v0/${list}/1.json`).then((r) =>
		r.json()
	);

	const selectedItem: Item | null = itemId
		? await fetch(`https://api.hnpwa.com/v0/item/${itemId}.json`).then((r) => r.json())
		: null;

	return {
		list: params.list,
		items,
		selectedItem
	};
};
