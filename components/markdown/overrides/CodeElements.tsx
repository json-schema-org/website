import React from 'react';
import Code from '~/components/Code';
import JsonEditor from '~/components/JsonEditor';

export const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <Code>{children}</Code>
);

export const PreBlock = ({ children }: { children: React.ReactNode }) => {
  const language = React.isValidElement(children)
    ? children.props.className
    : undefined;
  const isJsonCode = language === 'lang-json';
  const isJsoncCode = language === 'lang-jsonc';
  const code = React.isValidElement(children)
    ? children.props.children
    : children;

  if (isJsonCode) {
    return <JsonEditor initialCode={code} />;
  }

  if (isJsoncCode) {
    return <JsonEditor initialCode={code} isJsonc={true} />;
  }

  // Use JsonEditor for regular code blocks
  return <JsonEditor language={language} code={code} />;
};

export const codeOverrides = {
  code: { component: InlineCode },
  pre: { component: PreBlock },
};
