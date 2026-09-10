/**
 * Fixed, page-wide background: the same top-to-bottom
 * `--background` -> `--foreground` gradient the About page uses, plus a very
 * subtle hexagon texture (the same motif as the home page sections).
 *
 * Rendered once in the root layout and sits behind everything (`-z-10`), so
 * every route gets an identical backdrop. Page wrappers should stay transparent
 * (no `bg-foreground` / `bg-background`) so this shows through.
 */
export default function SiteBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[color:var(--background)] to-[color:var(--foreground)]"
        >
            <svg
                className="h-full w-full text-[color:var(--text-color)] opacity-[0.04]"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="site-hexagons"
                        width="50"
                        height="43.4"
                        patternUnits="userSpaceOnUse"
                        patternTransform="scale(2)"
                    >
                        <polygon
                            points="25,0 50,14.4 50,28.8 25,43.4 0,28.8 0,14.4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#site-hexagons)" />
            </svg>
        </div>
    );
}
