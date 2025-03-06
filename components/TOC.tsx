import React from 'react';

type Heading = {
  id: string;
  text: string;
};

type TOCProps = {
  headings?: Heading[];
};

const TOC: React.FC<TOCProps> = ({ headings = [] }) => {
  return (
    <nav className="p-4">
      <h2 className="text-xl font-bold mb-2">Table of Contents</h2>
      <ul className="list-disc">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-blue-500 hover:underline"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TOC;
