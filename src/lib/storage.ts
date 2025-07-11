export interface SavedPrompt {
  id: string;
  task: string;
  template: string;
  createdAt: string;
}

export interface TestResult {
  id: string;
  promptId: string;
  task: string;
  template: string;
  variables: string[];
  variableValues: Record<string, string>;
  result: string;
  createdAt: string;
}

export interface ApiConfig {
  baseURL: string;
  apiKey: string;
  modelName: string;
}

// API配置本地存储
export const saveApiConfig = (config: ApiConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('prompt-generator-api-config', JSON.stringify(config));
  }
};

export const loadApiConfig = (): ApiConfig | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('prompt-generator-api-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
};

// 保存的提示模板本地存储
export const savePrompt = (task: string, template: string): SavedPrompt => {
  const prompt: SavedPrompt = {
    id: Date.now().toString(),
    task,
    template,
    createdAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    const saved = loadSavedPrompts();
    saved.unshift(prompt); // 新的放在前面
    localStorage.setItem('prompt-generator-saved-prompts', JSON.stringify(saved));
  }

  return prompt;
};

export const loadSavedPrompts = (): SavedPrompt[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('prompt-generator-saved-prompts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
  }
  return [];
};

export const deleteSavedPrompt = (id: string) => {
  if (typeof window !== 'undefined') {
    const saved = loadSavedPrompts();
    const filtered = saved.filter(p => p.id !== id);
    localStorage.setItem('prompt-generator-saved-prompts', JSON.stringify(filtered));
  }
};

export const getSavedPromptById = (id: string): SavedPrompt | null => {
  const saved = loadSavedPrompts();
  return saved.find(p => p.id === id) || null;
};

// 测试结果本地存储
export const saveTestResult = (
  promptId: string,
  task: string,
  template: string,
  variables: string[],
  variableValues: Record<string, string>,
  result: string
): TestResult => {
  const testResult: TestResult = {
    id: Date.now().toString(),
    promptId,
    task,
    template,
    variables,
    variableValues,
    result,
    createdAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    const saved = loadTestResults();
    saved.unshift(testResult); // 新的放在前面
    localStorage.setItem('prompt-generator-test-results', JSON.stringify(saved));
  }

  return testResult;
};

export const loadTestResults = (): TestResult[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('prompt-generator-test-results');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
  }
  return [];
};

export const deleteTestResult = (id: string) => {
  if (typeof window !== 'undefined') {
    const saved = loadTestResults();
    const filtered = saved.filter(r => r.id !== id);
    localStorage.setItem('prompt-generator-test-results', JSON.stringify(filtered));
  }
};

export const getTestResultById = (id: string): TestResult | null => {
  const saved = loadTestResults();
  return saved.find(r => r.id === id) || null;
};

// 从模板中提取变量的工具函数
export const extractVariablesFromTemplate = (template: string): string[] => {
  const pattern = /\{\$([^}]+)\}/g;
  const variables = new Set<string>();
  let match;
  while ((match = pattern.exec(template)) !== null) {
    variables.add(match[1]);
  }
  return Array.from(variables);
};