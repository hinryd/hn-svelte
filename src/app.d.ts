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
