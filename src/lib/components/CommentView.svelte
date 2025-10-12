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
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    :global(html.dark) .comment {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
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
        color: rgb(107, 114, 128);
    }

    :global(html.dark) .meta {
        color: rgb(156, 163, 175);
    }

    .meta a {
        color: rgb(249, 115, 22);
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
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    :global(html.dark) .comment :global(pre) {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
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
</style>
