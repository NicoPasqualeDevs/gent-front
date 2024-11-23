export interface ToolData {
  id?: string;
  tool_name: string;
  type?: string;
  tool_code?: File | string;
  instruction?: string;
  user_id?: string;
}

export interface ToolRelationData {
  agent_tool_ids: number[];
  agent_id?: string;
  tool_id?: string;
  is_active?: boolean;
}
