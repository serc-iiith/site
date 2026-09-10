import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownContentProps {
    children: string;
    className?: string;
}

/**
 * Renders GitHub-flavoured Markdown (with raw HTML) inside a `prose` container.
 * Shared by the public blog page and the blog editor's live preview so they
 * stay identical.
 */
const MarkdownContent: React.FC<MarkdownContentProps> = ({ children, className = '' }) => (
    <div
        className={`prose lg:prose-xl max-w-none text-[var(--text-color)] prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-headings:text-[var(--text-color)] ${className}`}
    >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {children}
        </ReactMarkdown>
    </div>
);

export default MarkdownContent;
