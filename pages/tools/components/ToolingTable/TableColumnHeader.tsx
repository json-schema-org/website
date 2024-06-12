import React, { ReactNode } from 'react';

const TableColumnHeader = ({
  className,
  children,
}: {
  className: string;
  children: ReactNode | ReactNode[];
}) => {
  return (
    <th className={`px-4 py-2 border-b border-gray-200 ${className}`}>
      {children}
    </th>
  );
};

export default TableColumnHeader;
