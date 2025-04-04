export type License = {
    issuing_authority: string;
    cost: GLfloat;
    required_documents: string[];
    notes: string;
  };
  export type AgentState = {
    licenses: License[];
  };
