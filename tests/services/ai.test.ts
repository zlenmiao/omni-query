import { searchWithAI } from '@/services/ai';
import { config } from '@/lib/config';

// Mock fetch globally
global.fetch = jest.fn();

describe('AI Service', () => {
  beforeEach(() => {
    // Clear mock before each test
    (global.fetch as jest.Mock).mockClear();
  });

  it('should throw error for empty query', async () => {
    await expect(searchWithAI('')).rejects.toThrow('Query cannot be empty');
    await expect(searchWithAI('   ')).rejects.toThrow('Query cannot be empty');
  });

  it('should make correct API call', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: '# Test\n\n## 基本概述\n测试内容\n\n## 主要特征\n- 特征1\n- 特征2'
          }
        }
      ]
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const query = '测试查询';
    await searchWithAI(query);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      config.ai.endpoint,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.apiKey}`,
        },
        body: expect.any(String),
      })
    );

    const requestBody = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(requestBody).toEqual({
      model: config.ai.model,
      temperature: config.ai.temperature,
      max_tokens: config.ai.maxTokens,
      messages: expect.arrayContaining([
        expect.objectContaining({
          role: 'system',
          content: expect.any(String),
        }),
        expect.objectContaining({
          role: 'user',
          content: expect.stringContaining(query),
        }),
      ]),
    });
  });

  it('should handle API error', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    await expect(searchWithAI('测试查询')).rejects.toThrow('API request failed');
  });

  it('should handle empty API response', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ choices: [] }),
      })
    );

    await expect(searchWithAI('测试查询')).rejects.toThrow('No response from AI');
  });

  it('should return formatted content', async () => {
    const mockContent = '# Test\n\n## 基本概述\n测试内容\n\n## 主要特征\n- 特征1\n- 特征2';
    const mockResponse = {
      choices: [
        {
          message: {
            content: mockContent
          }
        }
      ]
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await searchWithAI('测试查询');
    expect(result).toEqual({
      content: mockContent,
    });
  });
});
