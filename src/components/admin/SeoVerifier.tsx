"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { getSeoVerifierEntries } from "@/lib/seoVerifier";

const groupOptions = ["all", "static", "blog", "news", "people"] as const;

export default function SeoVerifier() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof groupOptions)[number]>("all");
  const entries = useMemo(() => getSeoVerifierEntries(), []);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesGroup = group === "all" ? true : entry.routeGroup === group;
      const searchTarget = `${entry.title} ${entry.url} ${entry.schemaType}`.toLowerCase();
      const matchesQuery = searchTarget.includes(query.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [entries, group, query]);

  const copySnippet = async (snippet: string) => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("JSON-LD copied");
    } catch {
      toast.error("Could not copy JSON-LD");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--text-color)]">
          SEO Verifier
        </h1>
        <p className="mt-2 text-sm md:text-base text-[color:var(--secondary-color)] max-w-3xl">
          Review every public page schema snippet exactly as JSON-LD, copy it, and test the corresponding URL in Google Rich Results.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--secondary-color)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, URL, or schema type"
            className="w-full rounded-lg border border-[color:var(--border-color)] bg-[color:var(--foreground)] pl-10 pr-4 py-2.5 text-[color:var(--text-color)] outline-none focus:border-[color:var(--primary-color)]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {groupOptions.map((option) => (
            <button
              key={option}
              onClick={() => setGroup(option)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                group === option
                  ? "bg-[color:var(--primary-color)] text-white"
                  : "bg-[color:var(--foreground)] text-[color:var(--text-color)] border border-[color:var(--border-color)]"
              }`}
            >
              {option === "all" ? "All" : option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-[color:var(--secondary-color)]">
        Showing {filteredEntries.length} of {entries.length} schema entries
      </div>

      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const prettyJson = JSON.stringify(entry.jsonLd, null, 2);
          const scriptSnippet = `<script type="application/ld+json">\n${prettyJson}\n</script>`;
          const richResultsUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(entry.url)}`;

          return (
            <section
              key={entry.id}
              className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--background)] overflow-hidden"
            >
              <div className="p-4 md:p-5 border-b border-[color:var(--border-color)]">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="text-xs uppercase tracking-[0.14em] text-[color:var(--secondary-color)]">
                        {entry.routeGroup}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-[color:var(--primary-color)]/10 text-[color:var(--primary-color)]">
                        {entry.schemaType}
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-[color:var(--text-color)]">
                      {entry.title}
                    </h2>
                    <p className="mt-1 text-sm break-all text-[color:var(--secondary-color)]">
                      {entry.url}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copySnippet(scriptSnippet)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[color:var(--foreground)] border border-[color:var(--border-color)] text-[color:var(--text-color)] hover:border-[color:var(--primary-color)]"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <a
                      href={richResultsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[color:var(--primary-color)] text-white hover:opacity-90"
                    >
                      Test in Google Rich Results
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="text-xs uppercase tracking-[0.14em] text-[color:var(--secondary-color)] mb-3">
                  JSON-LD
                </div>
                <pre className="overflow-x-auto rounded-lg bg-[#0f172a] text-[#e2e8f0] p-4 text-xs md:text-sm leading-6">
                  <code>{scriptSnippet}</code>
                </pre>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
