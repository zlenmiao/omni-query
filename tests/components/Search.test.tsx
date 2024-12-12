import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '@/components/Search';
import { searchWithAI } from '@/services/ai';
import copy from 'clipboard-copy';

// Mock the AI service and clipboard-copy
jest.mock('@/services/ai');
jest.mock('clipboard-copy');

const mockSearchWithAI = searchWithAI as jest.MockedFunction<typeof searchWithAI>;
const mockCopy = copy as jest.MockedFunction<typeof copy>;

describe('Search Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockSearchWithAI.mockClear();
    mockCopy.mockClear();
    mockCopy.mockImplementation(() => Promise.resolve());
  });

  it('renders search input and button', () => {
    render(<Search />);
    
    expect(screen.getByPlaceholderText('输入你想了解的内容...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '搜索' })).toBeInTheDocument();
  });

  it('validates empty input', async () => {
    render(<Search />);
    
    const searchButton = screen.getByRole('button', { name: '搜索' });
    fireEvent.click(searchButton);
    
    expect(await screen.findByText('请输入搜索内容')).toBeInTheDocument();
  });

  it('validates input length', async () => {
    render(<Search />);
    
    const input = screen.getByPlaceholderText('输入你想了解的内容...');
    const longString = 'a'.repeat(101);
    
    await userEvent.type(input, longString);
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    
    expect(await screen.findByText('搜索内容不能超过100个字符')).toBeInTheDocument();
  });

  it('shows loading state during search', async () => {
    mockSearchWithAI.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<Search />);
    
    const input = screen.getByPlaceholderText('输入你想了解的内容...');
    await userEvent.type(input, '测试查询');
    
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    
    expect(await screen.findByText('搜索中')).toBeInTheDocument();
  });

  it('displays search results', async () => {
    const mockResult = {
      content: '# 测试\n\n## 基本概述\n测试内容\n\n## 主要特征\n- 特征1\n- 特征2',
    };
    
    mockSearchWithAI.mockResolvedValueOnce(mockResult);
    
    render(<Search />);
    
    const input = screen.getByPlaceholderText('输入你想了解的内容...');
    await userEvent.type(input, '测试查询');
    
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    
    await waitFor(() => {
      expect(screen.getByText('测试')).toBeInTheDocument();
      expect(screen.getByText('测试内容')).toBeInTheDocument();
    });
  });

  it('handles search error', async () => {
    mockSearchWithAI.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Search />);
    
    const input = screen.getByPlaceholderText('输入你想了解的内容...');
    await userEvent.type(input, '测试查询');
    
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    
    expect(await screen.findByText('API Error')).toBeInTheDocument();
  });

  it('clears error when input changes', async () => {
    render(<Search />);
    
    const input = screen.getByPlaceholderText('输入你想了解的内容...');
    
    // Trigger error
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    expect(await screen.findByText('请输入搜索内容')).toBeInTheDocument();
    
    // Clear error by typing
    await userEvent.type(input, '测试');
    expect(screen.queryByText('请输入搜索内容')).not.toBeInTheDocument();
  });

  // New tests for copy functionality
  it('copies plain text without markdown formatting', async () => {
    const mockResult = {
      content: '# 标题\n\n## 子标题\n\n正文内容\n\n- 列表项1\n- 列表项2',
    };
    
    mockSearchWithAI.mockResolvedValueOnce(mockResult);
    
    render(<Search />);
    
    // Trigger search
    const input = screen.getByPlaceholderText('输入你想了解的内容...');
    await userEvent.type(input, '测试查询');
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('标题')).toBeInTheDocument();
    });
    
    // Click copy text button
    const copyTextButton = screen.getByTestId('copy-text-button');
    fireEvent.click(copyTextButton);
    
    // Verify clipboard content
    expect(mockCopy).toHaveBeenCalledWith(
      expect.not.stringContaining('#')
    );
    
    // Check feedback
    await waitFor(() => {
      expect(copyTextButton).toHaveTextContent('已复制');
    });
  });

  it('copies markdown format', async () => {
    const mockResult = {
      content: '# 标题\n\n## 子标题\n\n正文内容',
    };
    
    mockSearchWithAI.mockResolvedValueOnce(mockResult);
    
    render(<Search />);
    
    // Trigger search
    const input = screen.getByPlaceholderText('输入你想了解的内容...');
    await userEvent.type(input, '测试查询');
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('标题')).toBeInTheDocument();
    });
    
    // Click copy markdown button
    const copyMarkdownButton = screen.getByTestId('copy-markdown-button');
    fireEvent.click(copyMarkdownButton);
    
    // Verify clipboard content
    expect(mockCopy).toHaveBeenCalledWith(mockResult.content);
    
    // Check feedback
    await waitFor(() => {
      expect(copyMarkdownButton).toHaveTextContent('已复制');
    });
  });

  it('handles copy error', async () => {
    const mockResult = {
      content: '# 测试内容',
    };
    
    mockSearchWithAI.mockResolvedValueOnce(mockResult);
    mockCopy.mockRejectedValueOnce(new Error('Copy failed'));
    
    render(<Search />);
    
    // Trigger search
    const input = screen.getByPlaceholderText('输入你想了解的内容...');
    await userEvent.type(input, '测试查询');
    fireEvent.click(screen.getByRole('button', { name: '搜索' }));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('测试内容')).toBeInTheDocument();
    });
    
    // Click copy button
    const copyButton = screen.getByTestId('copy-text-button');
    fireEvent.click(copyButton);
    
    // Check error message
    expect(await screen.findByText('复制失败')).toBeInTheDocument();
  });
});
