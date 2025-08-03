/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ReactNode } from 'react';

interface ResponsiveTableProps {
  children: ReactNode;
  maxMobileColumns?: number;
}

interface TableCellData {
  content: ReactNode;
  isHeader: boolean;
}

interface TableRowData {
  cells: TableCellData[];
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  children,
  maxMobileColumns = 3,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [tableData, setTableData] = useState<{
    headers: ReactNode[];
    rows: ReactNode[][];
    columnCount: number;
  } | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const extractTableData = () => {
      try {
        let headers: ReactNode[] = [];
        let rows: ReactNode[][] = [];
        let columnCount = 0;

        // Helper function to extract cell content recursively
        const extractCellContent = (element: any): ReactNode => {
          if (typeof element === 'string') return element;
          if (React.isValidElement(element)) {
            return element;
          }
          if (Array.isArray(element)) {
            return element.map((item, index) => (
              <span key={index}>{extractCellContent(item)}</span>
            ));
          }
          return element;
        };

        // Function to process table rows
        const processTableRows = (tableChildren: any[]) => {
          tableChildren.forEach((child: any) => {
            if (React.isValidElement(child)) {
              if (child.type === 'thead') {
                // Process header
                const theadChildren = React.Children.toArray(
                  (child as React.ReactElement).props.children,
                );
                theadChildren.forEach((tr: any) => {
                  if (
                    React.isValidElement(tr) &&
                    (tr as React.ReactElement).props.children
                  ) {
                    const thElements = React.Children.toArray(
                      (tr as React.ReactElement).props.children,
                    );
                    headers = thElements.map((th: any) =>
                      extractCellContent(th.props?.children),
                    );
                    columnCount = Math.max(columnCount, headers.length);
                  }
                });
              } else if (child.type === 'tbody') {
                // Process body rows
                const tbodyChildren = React.Children.toArray(
                  (child as React.ReactElement).props.children,
                );
                tbodyChildren.forEach((tr: any) => {
                  if (
                    React.isValidElement(tr) &&
                    (tr as React.ReactElement).props.children
                  ) {
                    const tdElements = React.Children.toArray(
                      (tr as React.ReactElement).props.children,
                    );
                    const rowData = tdElements.map((td: any) =>
                      extractCellContent(td.props?.children),
                    );
                    rows.push(rowData);
                    columnCount = Math.max(columnCount, rowData.length);
                  }
                });
              } else if (child.type === 'tr') {
                // Direct tr elements (no tbody)
                const cellElements = React.Children.toArray(
                  (child as React.ReactElement).props.children,
                );
                const rowData = cellElements.map((cell: any) =>
                  extractCellContent(cell.props?.children),
                );

                // If this is likely a header row (first row and no explicit thead)
                if (headers.length === 0 && rows.length === 0) {
                  headers = rowData;
                } else {
                  rows.push(rowData);
                }
                columnCount = Math.max(columnCount, rowData.length);
              }
            }
          });
        };

        // Start processing from the table element
        const processChildren = (elements: any) => {
          React.Children.forEach(elements, (child: any) => {
            if (React.isValidElement(child)) {
              if (child.type === 'table') {
                processTableRows(
                  React.Children.toArray(
                    (child as React.ReactElement).props.children,
                  ),
                );
              } else if (
                child &&
                typeof child === 'object' &&
                child.props &&
                typeof child.props === 'object' &&
                'children' in child.props &&
                child.props.children
              ) {
                processChildren(child.props.children);
              }
            }
          });
        };

        processChildren(children);

        setTableData({ headers, rows, columnCount });
      } catch (error) {
        console.warn('Error extracting table data:', error);
        setTableData(null);
      }
    };

    extractTableData();
  }, [children]);

  // Render as cards on mobile if table has too many columns
  if (isMobile && tableData && tableData.columnCount > maxMobileColumns) {
    return (
      <div className='mb-8 space-y-3'>
        {tableData.rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm'
          >
            {tableData.headers.map((header, colIndex) => {
              const cellContent = row[colIndex];
              const hasContent =
                cellContent &&
                (typeof cellContent === 'string' ? cellContent.trim() : true);

              return (
                <div key={colIndex} className='mb-3 last:mb-0'>
                  <div className='font-semibold text-sm text-black dark:text-white mb-1 border-b border-slate-100 dark:border-slate-700 pb-1'>
                    {header}
                  </div>
                  <div className='text-slate-600 dark:text-slate-300 leading-7'>
                    {hasContent ? (
                      cellContent
                    ) : (
                      <span className='text-slate-400 dark:text-slate-500'>
                        —
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // Render normal table (default behavior)
  return (
    <div className='max-w-[100%] mx-auto mb-8 overflow-auto'>
      <table className='table-auto w-full'>{children}</table>
    </div>
  );
};

export default ResponsiveTable;
