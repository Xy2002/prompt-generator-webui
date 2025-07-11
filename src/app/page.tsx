"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveApiConfig, loadApiConfig, savePrompt } from "@/lib/storage";
import { toast } from "sonner";

interface GeneratedPrompt {
  template: string;
  variables: string[];
}

// 提取提示模板的辅助函数
function extractBetweenTags(tag: string, text: string): string[] {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'gis');
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

function extractVariables(prompt: string): string[] {
  const pattern = /\{\$([^}]+)\}/g;
  const variables = new Set<string>();
  let match;
  while ((match = pattern.exec(prompt)) !== null) {
    variables.add(match[1]);
  }
  return Array.from(variables);
}

function removeEmptyTags(text: string): string {
  return text.replace(/\n<(\w+)>\s*<\/\1>\n/g, '');
}

function stripLastSentence(text: string): string {
  const sentences = text.split('. ');
  if (sentences[sentences.length - 1].startsWith("Let me know")) {
    sentences.pop();
    const result = sentences.join('. ');
    return result.endsWith('.') ? result : result + '.';
  }
  return text;
}

function extractPrompt(metapromptResponse: string): string {
  const instructionSections = extractBetweenTags("Instructions", metapromptResponse);
  if (instructionSections.length === 0) {
    return metapromptResponse.trim();
  }
  
  const instructions = instructionSections[0];
  const processed = stripLastSentence(removeEmptyTags(instructions.trim()));
  return processed;
}

export default function Home() {
  const [task, setTask] = useState("");
  const [variables, setVariables] = useState("");
  const [baseURL, setBaseURL] = useState("https://api.openai.com/v1");
  const [apiKey, setApiKey] = useState("");
  const [modelName, setModelName] = useState("gpt-4");
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);

  // 加载保存的API配置
  useEffect(() => {
    const savedConfig = loadApiConfig();
    if (savedConfig) {
      setBaseURL(savedConfig.baseURL);
      setApiKey(savedConfig.apiKey);
      setModelName(savedConfig.modelName);
    }
  }, []);

  // 保存API配置
  const handleSaveConfig = () => {
    if (baseURL.trim() && modelName.trim()) {
      saveApiConfig({
        baseURL: baseURL.trim(),
        apiKey: apiKey.trim(),
        modelName: modelName.trim(),
      });
      toast.success("API配置已保存");
    }
  };

  // 用于生成提示模板的聊天
  const generateChat = useChat({
    api: "/api/generate",
    body: {
      baseURL: baseURL.trim(),
      apiKey: apiKey.trim(),
      modelName: modelName.trim(),
      task: task.trim(),
      variables: variables
        .split(",")
        .map((v) => v.trim().toUpperCase())
        .filter((v) => v.length > 0),
    },
    onFinish: (message) => {
      // 构建变量字符串用于前置处理
      let variableString = "";
      if (variables.trim()) {
        variableString = variables
          .split(",")
          .map((v) => v.trim().toUpperCase())
          .filter((v) => v.length > 0)
          .map(v => `{$${v}}`)
          .join('\n');
      }
      
      const assistantPartial = "<Inputs>" + (variableString ? `\n${variableString}\n</Inputs>\n<Instructions Structure>` : "");
      const fullText = assistantPartial + message.content;
      
      // 提取提示模板
      const extractedPrompt = extractPrompt(fullText);
      const detectedVariables = extractVariables(extractedPrompt);

      const prompt = {
        template: extractedPrompt,
        variables: detectedVariables
      };

      setGeneratedPrompt(prompt);

      // 保存到本地存储 - 只保存任务和模板，变量从模板中动态提取
      savePrompt(task.trim(), extractedPrompt);
      
      toast.success("提示模板已生成并保存！");
    }
  });

  const handleGenerate = async () => {
    if (!task.trim() || !apiKey.trim()) {
      toast.error("请填写任务描述和API密钥");
      return;
    }

    setGeneratedPrompt(null);
    
    // 重置聊天状态
    generateChat.setMessages([]);
    
    await generateChat.append({
      role: "user",
      content: "生成提示模板",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">元提示生成器</h1>
        <p className="text-muted-foreground">
          输入您的任务描述，生成专业的提示模板
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>0. API 配置</CardTitle>
            <CardDescription>
              配置您的AI服务提供商信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Base URL
                </label>
                <Input
                  placeholder="https://api.openai.com/v1"
                  value={baseURL}
                  onChange={(e) => setBaseURL(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  OpenAI: https://api.openai.com/v1<br/>
                  OpenRouter: https://openrouter.ai/api/v1
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  模型名称
                </label>
                <Input
                  placeholder="gpt-4"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  例如: gpt-4, gpt-3.5-turbo, claude-3-sonnet
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                API 密钥 *
              </label>
              <Input
                type="password"
                placeholder="输入您的API密钥"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                您的API密钥将仅用于此次会话，不会被存储
              </p>
            </div>
            <Button 
              onClick={handleSaveConfig}
              variant="outline"
              className="w-full"
            >
              保存配置
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. 输入任务</CardTitle>
            <CardDescription>
              描述您希望AI完成的任务，例如：根据用户偏好为我从菜单中选择一个项目
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="请详细描述您的任务..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              rows={6}
            />
            <div>
              <label className="text-sm font-medium mb-2 block">
                可选变量 (用逗号分隔，例如：MENU, PREFERENCES)
              </label>
              <Input
                placeholder="例如：MENU, PREFERENCES, CONSTRAINTS"
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={!task.trim() || !apiKey.trim() || generateChat.isLoading}
              className="w-full"
            >
              {generateChat.isLoading ? "生成中..." : "生成提示模板"}
            </Button>
          </CardContent>
        </Card>

        {(generateChat.isLoading || generatedPrompt || generateChat.messages.length > 0) && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>2. 生成的提示模板</CardTitle>
                <CardDescription>
                  {generateChat.isLoading ? "正在生成中..." : `检测到的变量: ${generatedPrompt?.variables.join(", ") || "无"}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generateChat.isLoading 
                      ? generateChat.messages.find(m => m.role === 'assistant')?.content || "开始生成..."
                      : generatedPrompt?.template
                    }
                  </pre>
                </div>
                {generatedPrompt && generatedPrompt.variables.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      ✅ 提示模板已保存！您可以在 <strong>历史记录</strong> 页面查看所有保存的模板，并在 <strong>测试页面</strong> 进行测试。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
