import { config } from '@/lib/config';

export type SearchResult = {
  content: string;
};

export async function searchWithAI(query: string, locale: string = 'zh'): Promise<SearchResult> {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const outputLanguage = locale === 'zh' ? 'Chinese' : 'English';

  const prompt = `You are a knowledgeable research assistant. Please provide a comprehensive analysis of "${query}" with the latest information from reliable sources. Structure your response in ${outputLanguage} using the following format:

# ${query}

## ${locale === 'zh' ? '基本概述' : 'Overview'}
[${locale === 'zh' ? '100字以内的简明概括' : 'Concise summary within 100 words'}]

## ${locale === 'zh' ? '核心特征' : 'Key Features'}
- [${locale === 'zh' ? '关键特征1，支持证据' : 'Key feature 1 with supporting evidence'}]
- [${locale === 'zh' ? '关键特征2，支持证据' : 'Key feature 2 with supporting evidence'}]
- [${locale === 'zh' ? '关键特征3，支持证据' : 'Key feature 3 with supporting evidence'}]
(${locale === 'zh' ? '至少3点，最多5点' : 'Minimum 3, maximum 5 points'})

## ${locale === 'zh' ? '发展历程' : 'Development History'}
[${locale === 'zh' ? '按时间顺序列出重要事件和里程碑' : 'Chronological development with specific dates and milestones'}]

## ${locale === 'zh' ? '现状分析' : 'Current Status'}
### ${locale === 'zh' ? '最新进展' : 'Recent Developments'}
[${locale === 'zh' ? '最近6个月内的最新发展' : 'Recent developments within the last 6 months'}]

### ${locale === 'zh' ? '应用场景' : 'Applications'}
[${locale === 'zh' ? '当前的实际应用和用例' : 'Current real-world applications and use cases'}]

### ${locale === 'zh' ? '行业影响' : 'Industry Impact'}
[${locale === 'zh' ? '对相关行业和领域的影响' : 'Impact on relevant industries and domains'}]

## ${locale === 'zh' ? '未来展望' : 'Future Outlook'}
[${locale === 'zh' ? '未来趋势和潜在发展' : 'Future trends and potential developments'}]

## ${locale === 'zh' ? '相关信息' : 'Related Information'}
### ${locale === 'zh' ? '关联领域' : 'Related Fields'}
[${locale === 'zh' ? '相关领域和概念列表' : 'List of related fields and concepts'}]

### ${locale === 'zh' ? '参考来源' : 'References'}
[${locale === 'zh' ? '权威来源和最近出版物列表' : 'List of authoritative sources and recent publications'}]

Requirements:
1. Focus on accuracy and recency of information
2. Include specific dates and statistics where relevant
3. Prioritize factual information from authoritative sources
4. Maintain clear structure with proper Markdown formatting
5. Keep total response within 4096 tokens`;

  try {
    const response = await fetch(config.ai.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.ai.model,
        temperature: config.ai.temperature,
        max_tokens: config.ai.maxTokens,
        messages: [
          {
            role: 'system',
            content: `You are a professional research assistant with access to the latest information. Always verify facts and cite sources. Respond in ${outputLanguage} but process instructions in English for better accuracy.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    return { content };
  } catch (error) {
    console.error('AI Search Error:', error);
    throw error;
  }
}

export async function* streamSearchWithAI(query: string, locale: string = 'zh'): AsyncGenerator<string> {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const outputLanguage = locale === 'zh' ? 'Chinese' : 'English';

  const prompt = `You are a knowledgeable research assistant. Please provide a comprehensive analysis of "${query}" with the latest information from reliable sources. Structure your response in ${outputLanguage} using the following format:

# ${query}

## ${locale === 'zh' ? '基本概述' : 'Overview'}
[${locale === 'zh' ? '100字以内的简明概括' : 'Concise summary within 100 words'}]

## ${locale === 'zh' ? '核心特征' : 'Key Features'}
- [${locale === 'zh' ? '关键特征1，支持证据' : 'Key feature 1 with supporting evidence'}]
- [${locale === 'zh' ? '关键特征2，支持证据' : 'Key feature 2 with supporting evidence'}]
- [${locale === 'zh' ? '关键特征3，支持证据' : 'Key feature 3 with supporting evidence'}]
(${locale === 'zh' ? '至少3点，最多5点' : 'Minimum 3, maximum 5 points'})

## ${locale === 'zh' ? '发展历程' : 'Development History'}
[${locale === 'zh' ? '按时间顺序列出重要事件和里程碑' : 'Chronological development with specific dates and milestones'}]

## ${locale === 'zh' ? '现状分析' : 'Current Status'}
### ${locale === 'zh' ? '最新进展' : 'Recent Developments'}
[${locale === 'zh' ? '最近6个月内的最新发展' : 'Recent developments within the last 6 months'}]

### ${locale === 'zh' ? '应用场景' : 'Applications'}
[${locale === 'zh' ? '当前的实际应用和用例' : 'Current real-world applications and use cases'}]

### ${locale === 'zh' ? '行业影响' : 'Industry Impact'}
[${locale === 'zh' ? '对相关行业和领域的影响' : 'Impact on relevant industries and domains'}]

## ${locale === 'zh' ? '未来展望' : 'Future Outlook'}
[${locale === 'zh' ? '未来趋势和潜在发展' : 'Future trends and potential developments'}]

## ${locale === 'zh' ? '相关信息' : 'Related Information'}
### ${locale === 'zh' ? '关联领域' : 'Related Fields'}
[${locale === 'zh' ? '相关领域和概念列表' : 'List of related fields and concepts'}]

### ${locale === 'zh' ? '参考来源' : 'References'}
[${locale === 'zh' ? '权威来源和最近出版物列表' : 'List of authoritative sources and recent publications'}]

Requirements:
1. Focus on accuracy and recency of information
2. Include specific dates and statistics where relevant
3. Prioritize factual information from authoritative sources
4. Maintain clear structure with proper Markdown formatting
5. Keep total response within 4096 tokens`;

  try {
    const response = await fetch(config.ai.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.ai.model,
        temperature: config.ai.temperature,
        max_tokens: config.ai.maxTokens,
        stream: true,
        messages: [
          {
            role: 'system',
            content: `You are a professional research assistant with access to the latest information. Always verify facts and cite sources. Respond in ${outputLanguage} but process instructions in English for better accuracy.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('AI Stream Search Error:', error);
    throw error;
  }
}
