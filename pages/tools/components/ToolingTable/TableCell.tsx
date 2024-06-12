import React, { ReactNode } from 'react';

const TableCell = ({
  className,
  children,
}: {
  className: string;
  children: ReactNode | ReactNode[];
}) => {
  return (
    <td
      className={`px-4 py-2 border-b border-gray-200 lg:break-all ${className}`}
    >
      {children}
    </td>
  );
};

export default TableCell;
