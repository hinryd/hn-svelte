/// <reference types="@sveltejs/kit" />

declare global {
    namespace App {
        interface Error {
            frame?: string
        }
    }
}

type Item = {
    domain?: string
    id: number
    url: string
    title: string
    type: string
    time_ago: string
    points: number
    user: string
    comments_count: number
    comments: HNComment[]
    content: string
}

type HNComment = {
    id: number
    user: string
    time: number
    time_ago: string
    type: "comment"
    content: string
    comments: HNComment[]
    comments_count: number
    level: number
    url: string
}

type HNAlgoliaResult = {
    hits: HNAlgoliaHit[]
    page: number
    nbHits: number
    nbPages: number
    hitsPerPage: number
    exhaustiveNbHits: boolean
    exhaustiveTypo: boolean
    query: string
    params: string
    processingTimeMS: number
}

type HNAlgoliaHit = {
    objectID: string
    title?: string
    url?: string
    author: string
    points?: number
    story_text?: string | null
    comment_text?: string | null
    _tags: string[]
    num_comments?: number
    created_at: string
    created_at_i: number
    _highlightResult?: {
        title?: HNAlgoliaHighlight
        url?: HNAlgoliaHighlight
        author?: HNAlgoliaHighlight
    }
}

type HNAlgoliaHighlight = {
    value: string
    matchLevel: "none" | "partial" | "full"
    matchedWords: string[]
}