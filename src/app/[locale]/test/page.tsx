"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { loadApiConfig, getSavedPromptById, extractVariablesFromTemplate, saveTestResult, type SavedPrompt } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function TestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");
  const t = useTranslations('TestPage');

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
  const { messages, status, setMessages, append } = useChat({
    api: "/api/test",
    onFinish: (message) => {
      // 保存测试结果
      if (message.content && selectedPrompt) {
        saveTestResult(
          selectedPrompt.id,
          selectedPrompt.task,
          selectedPrompt.template,
          promptVariables,
          variableValues,
          message.content
        );
        toast.success(t('testResultSaved'));
      }
    },
    onError: (error) => {
      console.error('Test error:', error);
      // 尝试从错误中提取具体的错误信息
      let errorMessage = t('testError');

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage);
    }
  });

  // 防止用户在测试过程中离开页面
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'submitted' || status === 'streaming') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);


  const handleTest = async () => {
    if (!selectedPrompt || !apiConfig.apiKey) {
      toast.error(t('ensureConfigured'));
      return;
    }

    // 检查必填变量
    const emptyVariables = promptVariables.filter(
      variable => !variableValues[variable]?.trim()
    );

    if (emptyVariables.length > 0) {
      toast.error(`${t('fillAllVariables')}: ${emptyVariables.join(", ")}`);
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

    // 使用 useChat 的 append 方法
    try {
      await append({
        role: "user",
        content: promptWithVariables,
      }, {
        body: {
          baseURL: apiConfig.baseURL,
          apiKey: apiConfig.apiKey,
          modelName: apiConfig.modelName,
          template: selectedPrompt.template,
          variableValues,
        }
      });
    } catch (error) {
      console.error('Error in handleTest:', error);
      // 错误会通过 onError 回调处理
    }
  };

  if (!selectedPrompt) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {promptId ? t('notFound') : t('selectFromHistory')}
            </p>
            <Button onClick={() => router.push("/history")}>
              {t('goToHistory')}
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
          {t('back')}
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 提示模板信息 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('templateInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">{t('originalTask')}:</p>
              <p className="text-sm text-muted-foreground">{selectedPrompt.task}</p>
            </div>

            {promptVariables.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">{t('variables')}:</p>
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
              <p className="text-sm font-medium mb-2">{t('promptTemplate')}:</p>
              <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap text-xs">
                  {selectedPrompt.template}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('detectedVariableCount')}: {promptVariables.length}
                {promptVariables.length > 0 && (
                  ` - ${t('variables')}: ${promptVariables.join(', ')}`
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 变量输入 */}
        {promptVariables.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('inputVariables')}</CardTitle>
              <CardDescription>
                {t('inputVariablesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {promptVariables.map((variable) => (
                <div key={variable}>
                  <label className="text-sm font-medium mb-2 block">
                    {variable} *
                  </label>
                  <Textarea
                    placeholder={`${t('enterValue')} ${variable}...`}
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
                disabled={status === 'submitted' || status === 'streaming' || !apiConfig.apiKey}
                className="w-full"
              >
                {(status === 'submitted' || status === 'streaming') && (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                )}
                {status === 'submitted' || status === 'streaming' ? t('testing') : t('startTest')}
              </Button>
              {!apiConfig.apiKey && (
                <p className="text-sm text-destructive">
                  {t('configureApiKey')}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 测试结果 */}
        {(messages.length > 0 || status === 'submitted' || status === 'streaming') && (
          <Card className={(status === 'submitted' || status === 'streaming') ? "border-blue-200 dark:border-blue-800" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(status === 'submitted' || status === 'streaming') && (
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                )}
                {t('testResults')}
              </CardTitle>
              <CardDescription>
                {t('testResultsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`bg-muted p-4 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto custom-scrollbar ${status === 'submitted' ? 'animate-pulse' : ''}`}>
                <pre className="whitespace-pre-wrap text-sm">
                  {status === 'submitted' 
                    ? t('generating')
                    : messages.find(m => m.role === 'assistant')?.content || (status === 'streaming' ? t('generating') : "")
                  }
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
          <p>Loading...</p>
        </div>
      </div>
    }>
      <TestPageContent />
    </Suspense>
  );
}