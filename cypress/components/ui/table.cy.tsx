import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';

describe('Table Component', () => {
  it('renders complete Table with all subcomponents correctly', () => {
    cy.mount(
      <Table>
        <TableCaption>Test Table Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>30</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>25</TableCell>
            <TableCell>jane@example.com</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>2</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    cy.get('[data-slot="table-container"]').should('exist');
    cy.get('[data-slot="table"]').should('exist');
    cy.get('[data-slot="table-caption"]').should('exist');
    cy.get('[data-slot="table-header"]').should('exist');
    cy.get('[data-slot="table-body"]').should('exist');
    cy.get('[data-slot="table-footer"]').should('exist');
  });

  it('renders Table with custom className correctly', () => {
    cy.mount(
      <Table className='custom-table-class'>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table"]').should('have.class', 'custom-table-class');
  });

  it('renders TableContainer with correct styling', () => {
    cy.mount(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table-container"]')
      .should('exist')
      .and('have.class', 'relative')
      .and('have.class', 'w-full')
      .and('have.class', 'overflow-x-auto');
  });

  it('renders Table with correct base styling', () => {
    cy.mount(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table"]')
      .should('exist')
      .and('have.class', 'w-full')
      .and('have.class', 'caption-bottom')
      .and('have.class', 'text-sm');
  });

  it('renders TableHeader with correct styling', () => {
    cy.mount(
      <Table>
        <TableHeader className='custom-header-class'>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table-header"]')
      .should('exist')
      .and('have.class', 'custom-header-class')
      .and('have.class', '[&_tr]:border-b');
  });

  it('renders TableBody with correct styling', () => {
    cy.mount(
      <Table>
        <TableBody className='custom-body-class'>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table-body"]')
      .should('exist')
      .and('have.class', 'custom-body-class')
      .and('have.class', '[&_tr:last-child]:border-0');
  });

  it('renders TableFooter with correct styling', () => {
    cy.mount(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className='custom-footer-class'>
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    cy.get('[data-slot="table-footer"]')
      .should('exist')
      .and('have.class', 'custom-footer-class')
      .and('have.class', 'bg-muted/50')
      .and('have.class', 'border-t')
      .and('have.class', 'font-medium');
  });

  it('renders TableRow with correct styling and hover effects', () => {
    cy.mount(
      <Table>
        <TableBody>
          <TableRow className='custom-row-class' data-state='selected'>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table-row"]')
      .should('exist')
      .and('have.class', 'custom-row-class')
      .and('have.class', 'hover:bg-muted/50')
      .and('have.class', 'border-b')
      .and('have.class', 'transition-colors');

    // Check data-state attribute
    cy.get('[data-slot="table-row"]').should(
      'have.attr',
      'data-state',
      'selected',
    );
  });

  it('renders TableHead with correct styling', () => {
    cy.mount(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='custom-head-class'>Header Cell</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table-head"]')
      .should('exist')
      .and('contain.text', 'Header Cell')
      .and('have.class', 'custom-head-class')
      .and('have.class', 'h-10')
      .and('have.class', 'px-2')
      .and('have.class', 'text-left')
      .and('have.class', 'align-middle')
      .and('have.class', 'font-medium')
      .and('have.class', 'whitespace-nowrap');
  });

  it('renders TableCell with correct styling', () => {
    cy.mount(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className='custom-cell-class'>Cell Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table-cell"]')
      .should('exist')
      .and('contain.text', 'Cell Content')
      .and('have.class', 'custom-cell-class')
      .and('have.class', 'p-2')
      .and('have.class', 'align-middle')
      .and('have.class', 'whitespace-nowrap');
  });

  it('renders TableCaption with correct styling', () => {
    cy.mount(
      <Table>
        <TableCaption className='custom-caption-class'>
          Test Caption
        </TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    cy.get('[data-slot="table-caption"]')
      .should('exist')
      .and('contain.text', 'Test Caption')
      .and('have.class', 'custom-caption-class')
      .and('have.class', 'mt-4')
      .and('have.class', 'text-sm')
      .and('have.class', 'text-muted-foreground');
  });

  it('renders complex table structure correctly', () => {
    const data = [
      { name: 'Alice', role: 'Developer', department: 'Engineering' },
      { name: 'Bob', role: 'Designer', department: 'Design' },
      { name: 'Charlie', role: 'Manager', department: 'Management' },
    ];

    cy.mount(
      <Table>
        <TableCaption>Employee Directory</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((employee, index) => (
            <TableRow key={index}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.department}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total Employees</TableCell>
            <TableCell>{data.length}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    // Check caption
    cy.get('[data-slot="table-caption"]').should(
      'contain.text',
      'Employee Directory',
    );

    // Check header
    cy.get('[data-slot="table-header"]').should('exist');
    cy.get('[data-slot="table-head"]').should('have.length', 3);
    cy.get('[data-slot="table-head"]').eq(0).should('contain.text', 'Name');
    cy.get('[data-slot="table-head"]').eq(1).should('contain.text', 'Role');
    cy.get('[data-slot="table-head"]')
      .eq(2)
      .should('contain.text', 'Department');

    // Check body rows
    cy.get('[data-slot="table-body"] [data-slot="table-row"]').should(
      'have.length',
      3,
    );
    cy.get('[data-slot="table-body"] [data-slot="table-cell"]').should(
      'have.length',
      9,
    ); // 3 rows × 3 cells in body only

    // Check specific data
    cy.get('[data-slot="table-cell"]').eq(0).should('contain.text', 'Alice');
    cy.get('[data-slot="table-cell"]')
      .eq(1)
      .should('contain.text', 'Developer');
    cy.get('[data-slot="table-cell"]')
      .eq(2)
      .should('contain.text', 'Engineering');

    // Check footer
    cy.get('[data-slot="table-footer"]').should('exist');
    cy.get('[data-slot="table-footer"] [data-slot="table-cell"]')
      .eq(1)
      .should('contain.text', '3');
  });

  it('applies custom className to all table components', () => {
    cy.mount(
      <Table className='custom-table'>
        <TableCaption className='custom-caption'>Caption</TableCaption>
        <TableHeader className='custom-header'>
          <TableRow className='custom-header-row'>
            <TableHead className='custom-head'>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='custom-body'>
          <TableRow className='custom-body-row'>
            <TableCell className='custom-cell'>Content</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className='custom-footer'>
          <TableRow className='custom-footer-row'>
            <TableCell className='custom-footer-cell'>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    cy.get('[data-slot="table"]').should('have.class', 'custom-table');
    cy.get('[data-slot="table-caption"]').should(
      'have.class',
      'custom-caption',
    );
    cy.get('[data-slot="table-header"]').should('have.class', 'custom-header');
    cy.get('[data-slot="table-header"] [data-slot="table-row"]').should(
      'have.class',
      'custom-header-row',
    );
    cy.get('[data-slot="table-head"]').should('have.class', 'custom-head');
    cy.get('[data-slot="table-body"]').should('have.class', 'custom-body');
    cy.get('[data-slot="table-body"] [data-slot="table-row"]').should(
      'have.class',
      'custom-body-row',
    );
    cy.get('[data-slot="table-cell"]').should('have.class', 'custom-cell');
    cy.get('[data-slot="table-footer"]').should('have.class', 'custom-footer');
    cy.get('[data-slot="table-footer"] [data-slot="table-row"]').should(
      'have.class',
      'custom-footer-row',
    );
    cy.get('[data-slot="table-footer"] [data-slot="table-cell"]').should(
      'have.class',
      'custom-footer-cell',
    );
  });

  it('renders table with accessibility attributes correctly', () => {
    cy.mount(
      <Table>
        <TableCaption>Accessible Table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope='col'>Name</TableHead>
            <TableHead scope='col'>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
            <TableCell>30</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    // Check that table elements are properly structured
    cy.get('[data-slot="table"]').should('exist');
    cy.get('[data-slot="table-header"]').should('exist');
    cy.get('[data-slot="table-body"]').should('exist');

    // Check for proper table structure
    cy.get('[data-slot="table"]').should('be.visible');
    cy.get('[data-slot="table-caption"]').should(
      'contain.text',
      'Accessible Table',
    );
  });

  it('renders empty table structure correctly', () => {
    cy.mount(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{/* Empty body */}</TableBody>
      </Table>,
    );

    cy.get('[data-slot="table"]').should('exist');
    cy.get('[data-slot="table-header"]').should('exist');
    cy.get('[data-slot="table-body"]').should('exist');
    cy.get('[data-slot="table-body"] [data-slot="table-row"]').should(
      'have.length',
      0,
    );
  });
});
