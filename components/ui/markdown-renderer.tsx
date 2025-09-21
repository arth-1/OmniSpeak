import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  compact?: boolean;
}

export default function MarkdownRenderer({ content, className = "", compact = false }: MarkdownRendererProps) {
  const baseComponents = {
    h1: ({children}: any) => <h1 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-white mb-${compact ? '2' : '3'}`}>{children}</h1>,
    h2: ({children}: any) => <h2 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-white mb-2`}>{children}</h2>,
    h3: ({children}: any) => <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium text-white mb-${compact ? '1' : '2'}`}>{children}</h3>,
    p: ({children}: any) => <p className={`text-slate-300 mb-2 leading-relaxed ${compact ? 'text-sm' : ''}`}>{children}</p>,
    ul: ({children}: any) => <ul className={`list-disc list-inside text-slate-300 mb-${compact ? '2' : '3'} space-y-1`}>{children}</ul>,
    ol: ({children}: any) => <ol className={`list-decimal list-inside text-slate-300 mb-${compact ? '2' : '3'} space-y-1`}>{children}</ol>,
    li: ({children}: any) => <li className={`text-slate-300 ${compact ? 'text-sm' : ''}`}>{children}</li>,
    strong: ({children}: any) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({children}: any) => <em className="text-slate-200 italic">{children}</em>,
    code: ({children}: any) => <code className={`bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded ${compact ? 'text-xs' : 'text-sm'} font-mono`}>{children}</code>,
    pre: ({children}: any) => <pre className={`bg-slate-800 text-slate-200 p-${compact ? '2' : '3'} rounded overflow-x-auto ${compact ? 'text-xs' : 'text-sm'} font-mono border border-slate-600`}>{children}</pre>,
    blockquote: ({children}: any) => <blockquote className={`border-l-4 border-blue-500 pl-${compact ? '3' : '4'} italic text-slate-400 mb-${compact ? '2' : '3'}`}>{children}</blockquote>,
    hr: () => <hr className={`border-slate-600 my-${compact ? '2' : '4'}`} />,
    table: ({children}: any) => <table className="min-w-full border border-slate-600 rounded mb-3">{children}</table>,
    thead: ({children}: any) => <thead className="bg-slate-800">{children}</thead>,
    tbody: ({children}: any) => <tbody>{children}</tbody>,
    tr: ({children}: any) => <tr className="border-b border-slate-600">{children}</tr>,
    th: ({children}: any) => <th className="px-3 py-2 text-left text-white font-semibold">{children}</th>,
    td: ({children}: any) => <td className="px-3 py-2 text-slate-300">{children}</td>,
    a: ({children, href}: any) => <a href={href} className="text-blue-400 hover:text-blue-300 underline">{children}</a>,
    br: () => <br className={`my-${compact ? '1' : '2'}`} />
  };

  return (
    <div className={`prose prose-sm max-w-none prose-invert ${className}`}>
      <ReactMarkdown components={baseComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}