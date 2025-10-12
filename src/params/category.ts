import type { ParamMatcher } from '@sveltejs/kit';

const categories = new Set(['top', 'new', 'best', 'show', 'ask', 'jobs']);

export const match = ((name) => categories.has(name)) satisfies ParamMatcher;
