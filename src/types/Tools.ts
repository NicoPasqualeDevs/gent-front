export interface ToolData {
  id?: string;
  tool_name: string;
  type?: string;
  tool_code?: File | string;
  instruction?: string;
  user_id?: string;
}

export interface ToolRelationshipData {
  agent_tool_ids: number[];
}
