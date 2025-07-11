"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { loadApiConfig, getSavedPromptById, extractVariablesFromTemplate, type SavedPrompt } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function TestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);
  const [promptVariables, setPromptVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [apiConfig, setApiConfig] = useState({ baseURL: "", apiKey: "", modelName: "" });

  useEffect(() => {
    // 加载API配置
    const config = loadApiConfig();
    if (config) {
      setApiConfig(config);
    }

    // 如果有提示ID，加载对应的提示
    if (promptId) {
      const prompt = getSavedPromptById(promptId);
      if (prompt) {
        setSelectedPrompt(prompt);
        
        // 从模板中提取变量
        const variables = extractVariablesFromTemplate(prompt.template);
        setPromptVariables(variables);
        
        // 初始化变量值
        const initialValues: Record<string, string> = {};
        variables.forEach(variable => {
          initialValues[variable] = "";
        });
        setVariableValues(initialValues);
      }
    }
  }, [promptId]);

  // 用于测试提示模板的聊天
  const { messages, isLoading, setMessages } = useChat({
    api: "/api/test",
    onError: (error) => {
      console.error('Test error:', error);
      toast.error('测试时发生错误: ' + error.message);
    }
  });

  const handleTest = async () => {
    if (!selectedPrompt || !apiConfig.apiKey) {
      toast.error("请确保已选择提示模板并配置API密钥");
      return;
    }

    // 检查必填变量
    const emptyVariables = promptVariables.filter(
      variable => !variableValues[variable]?.trim()
    );

    if (emptyVariables.length > 0) {
      toast.error(`请填写所有变量: ${emptyVariables.join(", ")}`);
      return;
    }

    // 清空之前的消息
    setMessages([]);

    // 替换模板中的变量
    let promptWithVariables = selectedPrompt.template;
    for (const [variable, value] of Object.entries(variableValues)) {
      const pattern = new RegExp(`\\{\\$${variable}\\}`, 'g');
      promptWithVariables = promptWithVariables.replace(pattern, value);
    }

    // 手动调用API进行测试
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseURL: apiConfig.baseURL,
          apiKey: apiConfig.apiKey,
          modelName: apiConfig.modelName,
          template: selectedPrompt.template,
          variableValues,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '测试失败');
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let fullText = "";
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('0:"')) {
              try {
                const content = JSON.parse(line.substring(2));
                fullText += content;
                // 更新消息以显示流式内容
                setMessages([
                  { id: '1', role: 'user', content: promptWithVariables },
                  { id: '2', role: 'assistant', content: fullText }
                ]);
              } catch {
                // 忽略解析错误
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('Error testing prompt:', error);
      toast.error('测试时发生错误: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  if (!selectedPrompt) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold">测试提示模板</h1>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {promptId ? "找不到指定的提示模板" : "请从历史记录页面选择要测试的提示模板"}
            </p>
            <Button onClick={() => router.push("/history")}>
              前往历史记录
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <div>
          <h1 className="text-3xl font-bold">测试提示模板</h1>
          <p className="text-muted-foreground">
            为变量输入值并测试提示模板的效果
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 提示模板信息 */}
        <Card>
          <CardHeader>
            <CardTitle>提示模板信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">原始任务:</p>
              <p className="text-sm text-muted-foreground">{selectedPrompt.task}</p>
            </div>
            
            {promptVariables.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">变量:</p>
                <div className="flex flex-wrap gap-1">
                  {promptVariables.map((variable, index) => (
                    <Badge key={index} variant="secondary">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">提示模板:</p>
              <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap text-xs">
                  {selectedPrompt.template}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                检测到的变量数量: {promptVariables.length}
                {promptVariables.length > 0 && (
                  ` - 变量: ${promptVariables.join(', ')}`
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 变量输入 */}
        {promptVariables.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>输入变量值</CardTitle>
              <CardDescription>
                为每个变量输入具体的值来测试提示模板
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {promptVariables.map((variable) => (
                <div key={variable}>
                  <label className="text-sm font-medium mb-2 block">
                    {variable} *
                  </label>
                  <Textarea
                    placeholder={`输入 ${variable} 的值...`}
                    value={variableValues[variable] || ""}
                    onChange={(e) => {
                      setVariableValues((prev) => ({
                        ...prev,
                        [variable]: e.target.value,
                      }));
                    }}
                    rows={3}
                  />
                </div>
              ))}
              <Button 
                onClick={handleTest} 
                disabled={isLoading || !apiConfig.apiKey}
                className="w-full"
              >
                {isLoading ? "测试中..." : "开始测试"}
              </Button>
              {!apiConfig.apiKey && (
                <p className="text-sm text-destructive">
                  请先在主页面配置API密钥
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 测试结果 */}
        {(messages.length > 0 || isLoading) && (
          <Card>
            <CardHeader>
              <CardTitle>测试结果</CardTitle>
              <CardDescription>
                AI根据您的提示模板和变量值生成的内容
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap text-sm">
                  {isLoading ? "正在生成中..." : 
                   messages.find(m => m.role === 'assistant')?.content || ""}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <p>加载中...</p>
        </div>
      </div>
    }>
      <TestPageContent />
    </Suspense>
  );
}