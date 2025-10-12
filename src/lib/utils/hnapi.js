// Hacker News Firebase API utilities
const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

// Map our route names to HN API endpoints
const STORY_TYPES = {
	top: 'topstories',
	new: 'newstories',
	best: 'beststories',
	show: 'showstories',
	ask: 'askstories',
	jobs: 'jobstories'
};

/**
 * Format Unix timestamp to relative time
 */
export function formatTimeAgo(timestamp) {
	const now = Date.now() / 1000;
	const diff = now - timestamp;

	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
	if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
	return `${Math.floor(diff / 2592000)} months ago`;
}

/**
 * Extract domain from URL
 */
export function extractDomain(url) {
	if (!url) return null;
	try {
		const urlObj = new URL(url);
		return urlObj.hostname.replace('www.', '');
	} catch {
		return null;
	}
}

/**
 * Fetch a single item from HN API
 */
export async function fetchItem(id) {
	const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
	const item = await response.json();

	if (!item) return null;

	// Transform to match our UI expectations
	return {
		id: item.id,
		title: item.title || '',
		url: item.url || null,
		domain: extractDomain(item.url),
		points: item.score || 0,
		user: item.by || 'unknown',
		time_ago: formatTimeAgo(item.time),
		time: item.time,
		comments_count: item.descendants || 0,
		type: item.type || 'story',
		text: item.text || null,
		content: item.text || null,
		kids: item.kids || [],
		comments: [] // Will be populated when loading comments
	};
}

/**
 * Fetch multiple items in parallel
 */
export async function fetchItems(ids) {
	const promises = ids.map((id) => fetchItem(id));
	const items = await Promise.all(promises);
	return items.filter((item) => item !== null);
}

/**
 * Fetch story IDs for a given list type
 */
export async function fetchStoryIds(listType) {
	const endpoint = STORY_TYPES[listType] || STORY_TYPES.top;
	const response = await fetch(`${HN_API_BASE}/${endpoint}.json`);
	return await response.json();
}

/**
 * Fetch a page of stories (paginated)
 */
export async function fetchStoryPage(listType, page = 1, pageSize = 30) {
	const allIds = await fetchStoryIds(listType);
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const pageIds = allIds.slice(startIndex, endIndex);

	return await fetchItems(pageIds);
}

/**
 * Fetch comments recursively
 */
export async function fetchComments(kids) {
	if (!kids || kids.length === 0) return [];

	const comments = await Promise.all(
		kids.map(async (id) => {
			const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
			const comment = await response.json();

			if (!comment || comment.deleted || comment.dead) {
				return null;
			}

			// Recursively fetch child comments
			const childComments =
				comment.kids && comment.kids.length > 0 ? await fetchComments(comment.kids) : [];

			return {
				id: comment.id,
				user: comment.by || 'unknown',
				time_ago: formatTimeAgo(comment.time),
				content: comment.text || '',
				comments: childComments,
				deleted: comment.deleted || false
			};
		})
	);

	return comments.filter((comment) => comment !== null);
}

/**
 * Fetch full item with comments
 */
export async function fetchItemWithComments(id) {
	const item = await fetchItem(id);
	if (!item) return null;

	// Fetch all comments
	if (item.kids && item.kids.length > 0) {
		item.comments = await fetchComments(item.kids);
	}

	return item;
}

/**
 * Fetch user profile
 */
export async function fetchUser(username) {
	const response = await fetch(`${HN_API_BASE}/user/${username}.json`);
	const user = await response.json();

	if (!user) return null;

	return {
		id: user.id,
		created: formatTimeAgo(user.created),
		karma: user.karma || 0,
		about: user.about || null
	};
}
