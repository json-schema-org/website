import formatBlogDate from '~/lib/formatBlogDate';

const postPageOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const cardOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

describe('formatBlogDate', () => {
  it('should show the frontmatter calendar date, not the previous day', () => {
    expect(formatBlogDate('2023-05-08', postPageOptions)).to.equal(
      'Monday, May 8, 2023',
    );
    expect(formatBlogDate('2023-05-08', cardOptions)).to.equal('May 8, 2023');
  });

  it('should keep the same day for dates that used to shift west of UTC', () => {
    expect(formatBlogDate('2026-07-06', cardOptions)).to.equal('July 6, 2026');
    expect(formatBlogDate('2026-01-15', cardOptions)).to.equal(
      'January 15, 2026',
    );
    expect(formatBlogDate('2025-12-16', cardOptions)).to.equal(
      'December 16, 2025',
    );
    expect(formatBlogDate('2025-11-03', cardOptions)).to.equal(
      'November 3, 2025',
    );
  });

  it('should treat a non-ISO frontmatter date as the same calendar day', () => {
    expect(formatBlogDate('2026-5-16', cardOptions)).to.equal('May 16, 2026');
    expect(formatBlogDate('2026-05-16', cardOptions)).to.equal('May 16, 2026');
  });

  it('should format a full ISO timestamp in UTC', () => {
    expect(formatBlogDate('2023-05-08T00:00:00.000Z', cardOptions)).to.equal(
      'May 8, 2023',
    );
  });
});
