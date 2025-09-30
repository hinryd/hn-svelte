export async function load({ params, fetch, url }) {
	const list = params.list === 'top' ? 'news' : params.list === 'new' ? 'newest' : params.list;
	const itemId = url.searchParams.get('item');

	// Load initial page of items
	const itemsPromise = await fetch(`https://api.hnpwa.com/v0/${list}/1.json`).then((r) => r.json());

	// Load selected item if provided
	const selectedItemPromise = itemId
		? await fetch(`https://api.hnpwa.com/v0/item/${itemId}.json`).then((r) => r.json())
		: null;

	return {
		list: params.list,
		items: itemsPromise,
		itemId,
		selectedItem: selectedItemPromise
	};
}
