<script lang="ts">
    import CommentView from "./CommentView.svelte"
    import { browser } from "$app/environment"

    let { comment }: { comment: HNComment } = $props()
</script>

<article class="comment">
    <details open>
        <summary>
            <div class="meta-bar" role="button" tabindex="0">
                <span class="meta">
                    <a href="/user/{comment.user}">{comment.user}</a>
                    {comment.time_ago}
                </span>
            </div>
        </summary>

        {#if browser}
            <div class="body">
                {@html comment.content}
            </div>
        {/if}

        {#if comment.comments.length > 0}
            <ul class="children">
                {#each comment.comments as child}
                    <li><CommentView comment={child} /></li>
                {/each}
            </ul>
        {/if}
    </details>
</article>

<style>
    .comment {
        border-top: 1px solid var(--border-subtle);
    }

    :global(html.dark) .comment {
        border-top: 1px solid var(--border-subtle);
    }

    .meta-bar {
        padding: 0.8em 0;
        cursor: pointer;
        background: 100% 50% no-repeat url(/unfold.svg);
        background-size: 1em 1em;
    }

    .comment details[open] > summary > .meta-bar {
        background-image: url(/fold.svg);
    }

    .comment details > summary {
        list-style-type: none;
    }

    .comment details > summary::marker,
    .comment details > summary::-webkit-details-marker {
        display: none;
    }

    .comment .children {
        padding: 0 0 0 1em;
        margin: 0;
    }

    @media (min-width: 720px) {
        .comment .children {
            padding: 0 0 0 2em;
        }
    }

    li {
        list-style: none;
    }

    .meta {
        display: block;
        font-size: 14px;
        color: var(--text-secondary);
    }

    :global(html.dark) .meta {
        color: var(--text-secondary);
    }

    .meta a {
        color: var(--accent);
        text-decoration: none;
        font-weight: 500;
    }

    .meta a:hover {
        text-decoration: underline;
    }

    /* prevent crazy overflow layout bug on mobile */
    .body :global(*) {
        overflow-wrap: break-word;
        line-height: 1.6;
    }

    .body :global(p) {
        margin: 0.5em 0;
    }

    .comment :global(pre) {
        background: var(--code-bg);
        border: 1px solid var(--code-border);
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1rem 0;
        line-height: 1.5;
    }

    .comment :global(code) {
        font-family: var(--font-mono);
        font-size: 0.875em;
        color: var(--code-text);
        font-variant-ligatures: common-ligatures;
    }

    .comment :global(pre code) {
        display: block;
        background: transparent;
        border: none;
        padding: 0;
    }

    .comment :global(:not(pre) > code) {
        background: var(--code-bg);
        border: 1px solid var(--code-border);
        padding: 0.15em 0.4em;
        border-radius: 0.25rem;
        font-size: 0.85em;
    }

    :global(.content-html p) {
        margin: 0.5em 0;
        line-height: 1.6;
    }

    :global(.content-html a) {
        color: var(--accent);
        text-decoration: underline;
    }

    :global(.content-html pre) {
        background: var(--code-bg);
        border: 1px solid var(--code-border);
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1rem 0;
        line-height: 1.5;
    }

    :global(.content-html code) {
        font-family: var(--font-mono);
        font-size: 0.875em;
        color: var(--code-text);
        font-variant-ligatures: common-ligatures;
    }

    :global(.content-html pre code) {
        display: block;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 0;
    }

    :global(.content-html :not(pre) > code) {
        background: var(--code-bg);
        border: 1px solid var(--code-border);
        padding: 0.15em 0.4em;
        border-radius: 0.25rem;
        font-size: 0.85em;
    }

    /* Syntax highlighting hints */
    :global(.content-html pre code .comment) {
        color: var(--code-comment);
        font-style: italic;
    }

    :global(.content-html pre code .keyword) {
        color: var(--code-keyword);
        font-weight: 500;
    }

    :global(.content-html pre code .string) {
        color: var(--code-string);
    }

    :global(.content-html pre code .function) {
        color: var(--code-function);
    }

    :global(.content-html pre code .number) {
        color: var(--code-number);
    }
</style>
