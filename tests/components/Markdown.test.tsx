import { render, screen } from '@testing-library/react';
import Markdown from '@/components/Markdown';

describe('Markdown Component', () => {
  it('renders markdown content correctly', () => {
    const content = `# Heading 1\n## Heading 2\nSome paragraph`;
    render(<Markdown content={content} />);
    
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
    expect(screen.getByText('Some paragraph')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const content = '# Test';
    const { container } = render(<Markdown content={content} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders lists correctly', () => {
    const content = `
- Item 1
- Item 2
- Item 3
    `;
    render(<Markdown content={content} />);
    
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Item 1');
    expect(items[1]).toHaveTextContent('Item 2');
    expect(items[2]).toHaveTextContent('Item 3');
  });

  it('renders code blocks with syntax highlighting', () => {
    const content = '```javascript\nconst test = "hello";\n```';
    const { container } = render(<Markdown content={content} />);
    
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.querySelector('pre')).toBeInTheDocument();
  });

  it('renders links correctly', () => {
    const content = '[Test Link](https://example.com)';
    render(<Markdown content={content} />);
    
    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('handles empty content', () => {
    const { container } = render(<Markdown content="" />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('sanitizes HTML in markdown', () => {
    const content = '<script>alert("test")</script> Safe text';
    render(<Markdown content={content} />);
    
    expect(screen.queryByText('alert("test")')).not.toBeInTheDocument();
    expect(screen.getByText('Safe text')).toBeInTheDocument();
  });
});
