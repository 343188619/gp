import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-serif text-amber-500 mb-4 mt-6 border-b border-slate-700 pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-serif text-slate-200 mb-3 mt-5 flex items-center gap-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-indigo-300 mb-2 mt-4" {...props} />,
          p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4 text-justify" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-4 text-slate-300" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          strong: ({node, ...props}) => <strong className="text-amber-200 font-semibold" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-amber-500 pl-4 py-2 my-4 bg-slate-800/50 italic text-slate-400 rounded-r" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};