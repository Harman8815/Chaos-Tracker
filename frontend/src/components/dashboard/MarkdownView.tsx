import { useEffect, useState } from 'react';
import { marked } from 'marked';

const MarkdownView: React.FC<{ content: string }> = ({ content }) => {
    const [html, setHtml] = useState('');

    useEffect(() => {
        if (!content) {
            setHtml('');
            return;
        }
        try {
            const result = marked.parse(content, { breaks: true, gfm: true });
            if (result instanceof Promise) {
                result.then(setHtml);
            } else {
                setHtml(result);
            }
        } catch (e) {
            console.error("Markdown parsing error", e);
            setHtml(content);
        }
    }, [content]);

    return (
        <div
            className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export { MarkdownView };
