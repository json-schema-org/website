import React from 'react';

const checkHasContent = (reactNode: React.ReactNode): boolean => {
  if (reactNode === null || reactNode === undefined) return false;
  if (typeof reactNode === 'string' || typeof reactNode === 'number')
    return true;
  if (Array.isArray(reactNode)) {
    return reactNode.some(checkHasContent);
  }
  // Check if it's a valid React element
  if (React.isValidElement(reactNode)) {
    const children = reactNode.props.children;
    return checkHasContent(children);
  }
  return false;
};

export const Table = ({ children }: { children: React.ReactNode }) => (
  <div className='max-w-[100%] mx-auto mb-8 overflow-auto'>
    <table className='table-auto'>{children}</table>
  </div>
);

export const TableHead = ({ children }: { children: React.ReactNode }) => {
  const isEmpty = !checkHasContent(children);
  if (isEmpty) return null;
  return <thead className='table-auto bg-slate-100'>{children}</thead>;
};

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className='border border-slate-300 dark:text-white p-4 dark:bg-slate-900 font-semibold text-black'>
    {children}
  </th>
);

export const TableCell = ({
  children,
  rowSpan,
}: {
  children: React.ReactNode;
  rowSpan?: number;
}) => (
  <td className='border border-slate-200 p-4' rowSpan={rowSpan}>
    {children}
  </td>
);

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className='even:bg-blue-50 dark:even:bg-slate-900 even:bg-opacity-40'>
    {children}
  </tr>
);

export const tableOverrides = {
  table: { component: Table },
  thead: { component: TableHead },
  th: { component: TableHeader },
  td: { component: TableCell },
  tr: { component: TableRow },
};
