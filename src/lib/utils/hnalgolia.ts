export const searchStories = async (query: string) => {
    try {
        const response = await fetch(
            `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=30`
        )
        const data = await response.json()

        return data.hits.map((hit: any) => {
            const date = new Date(hit.created_at)
            const now = new Date()
            const diff = Math.floor((now - date) / 1000)

            let time_ago
            if (diff < 60) time_ago = "just now"
            else if (diff < 3600)
                time_ago = `${Math.floor(diff / 60)} minutes ago`
            else if (diff < 86400)
                time_ago = `${Math.floor(diff / 3600)} hours ago`
            else if (diff < 2592000)
                time_ago = `${Math.floor(diff / 86400)} days ago`
            else time_ago = `${Math.floor(diff / 2592000)} months ago`

            const extractDomain = (url: string | null) => {
                if (!url) return null
                try {
                    const urlObj = new URL(url)
                    return urlObj.hostname.replace("www.", "")
                } catch {
                    return null
                }
            }

            return {
                id: hit.objectID,
                title: hit.title || hit.story_title,
                url: hit.url,
                domain: extractDomain(hit.url),
                points: hit.points || 0,
                user: hit.author || "unknown",
                time_ago,
                time: Math.floor(date.getTime() / 1000),
                comments_count: hit.num_comments || 0,
                type: "story"
            }
        })
    } catch (error) {
        console.error("Search failed:", error)
        return []
    }
}
