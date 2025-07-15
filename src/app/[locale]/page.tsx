"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveApiConfig, loadApiConfig, savePrompt } from "@/lib/storage";
import { toast } from "sonner";
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('HomePage');
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
      toast.success(t('configSaved'));
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

      toast.success(t('templateGenerated'));
    },
    onError: (error) => {
      // 尝试从错误中提取具体的错误信息
      let errorMessage = t('generationError');

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage);
    }
  });

  // 防止用户在生成过程中离开页面
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (generateChat.status === 'submitted' || generateChat.status === 'streaming') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [generateChat.status]);

  const handleGenerate = async () => {
    if (!task.trim() || !apiKey.trim()) {
      toast.error(t('fillTaskAndApiKey'));
      return;
    }

    setGeneratedPrompt(null);

    // 重置聊天状态
    generateChat.setMessages([]);

    await generateChat.append({
      role: "user",
      content: t('generatePromptText'),
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>0. {t('apiConfig')}</CardTitle>
            <CardDescription>
              {t('apiConfigDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('baseUrl')}
                </label>
                <Input
                  placeholder="https://api.openai.com/v1"
                  value={baseURL}
                  onChange={(e) => setBaseURL(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('openaiExample')}<br />
                  {t('openrouterExample')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('modelName')}
                </label>
                <Input
                  placeholder="gpt-4"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('modelExample')}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('apiKeyRequired')}
              </label>
              <Input
                type="password"
                placeholder={t('apiKeyPlaceholder')}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('apiKeyNote')}
              </p>
            </div>
            <Button
              onClick={handleSaveConfig}
              variant="outline"
              className="w-full"
            >
              {t('saveConfig')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. {t('inputTask')}</CardTitle>
            <CardDescription>
              {t('inputTaskDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t('taskPlaceholder')}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              rows={6}
            />
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('optionalVariables')}
              </label>
              <Input
                placeholder={t('variablesPlaceholder')}
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={!task.trim() || !apiKey.trim() || generateChat.status === 'submitted' || generateChat.status === 'streaming'}
                className="flex-1"
              >
                {(generateChat.status === 'submitted' || generateChat.status === 'streaming') && (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                )}
                {generateChat.status === 'submitted' || generateChat.status === 'streaming' ? t('generating') : t('generateTemplate')}
              </Button>
              {(generateChat.status === 'submitted' || generateChat.status === 'streaming') && (
                <Button
                  onClick={generateChat.stop}
                  variant="outline"
                  className="px-4"
                >
                  {t('stop')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {(generateChat.status === 'submitted' || generateChat.status === 'streaming' || generatedPrompt || generateChat.messages.length > 0) && (
          <>
            <Card className={(generateChat.status === 'submitted' || generateChat.status === 'streaming') ? "border-blue-200 dark:border-blue-800" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(generateChat.status === 'submitted' || generateChat.status === 'streaming') && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  )}
                  2. {t('generatedTemplate')}
                </CardTitle>
                <CardDescription>
                  {(generateChat.status === 'submitted' || generateChat.status === 'streaming') ? t('generatingInProgress') : `${t('detectedVariables')}: ${generatedPrompt?.variables.join(", ") || t('noVariables')}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto custom-scrollbar ${(generateChat.status === 'submitted' || generateChat.status === 'streaming') ? 'animate-pulse' : ''}`}>
                  <pre className="whitespace-pre-wrap text-sm">
                    {(generateChat.status === 'submitted' || generateChat.status === 'streaming')
                      ? generateChat.messages.find(m => m.role === 'assistant')?.content || t('startGenerating')
                      : generatedPrompt?.template
                    }
                  </pre>
                </div>
                {generatedPrompt && generatedPrompt.variables.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {t('templateSaved')}
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
