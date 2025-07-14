import { NextRequest } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(request: NextRequest) {
  try {
    const { baseURL, apiKey, modelName, template, variableValues } = await request.json();

    if (!apiKey || typeof apiKey !== 'string') {
      return Response.json(
        { error: 'API密钥不能为空' },
        { status: 400 }
      );
    }

    if (!template || typeof template !== 'string') {
      return Response.json(
        { error: '提示模板不能为空' },
        { status: 400 }
      );
    }

    const openai = createOpenAI({
      baseURL: baseURL || 'https://api.openai.com/v1',
      apiKey
    });

    // 替换模板中的变量
    let promptWithVariables = template;
    if (variableValues && typeof variableValues === 'object') {
      for (const [variable, value] of Object.entries(variableValues)) {
        const pattern = new RegExp(`\\{\\$${variable}\\}`, 'g');
        promptWithVariables = promptWithVariables.replace(pattern, value as string);
      }
    }

    // 使用 streamText 测试生成的提示
    const result = streamText({
      model: openai(modelName || 'gpt-4'),
      prompt: promptWithVariables,
      maxTokens: 4096,
      temperature: 0
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        return (error as {message: string}).message;
      }
    });

  } catch (error) {
    console.error('Error testing prompt:', error);
    return Response.json(
      { error: '测试提示时发生错误: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    );
  }
}