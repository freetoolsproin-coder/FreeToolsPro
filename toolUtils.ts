interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
}

export const groupByCategory = (tools: Tool[]): Record<string, Tool[]> => {
  return tools.reduce((acc, tool) => {
    const category = tool.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
};