export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  evidence?: {
    projectId?: string;
    projectName?: string;
    metrics?: Record<string, string | number>;
    drivers?: string[];
    recommendations?: string[];
    dataSource: string;
  };
  suggestedQuestions?: string[];
}
