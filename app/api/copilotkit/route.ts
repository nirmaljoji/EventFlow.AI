import {
  CopilotRuntime,
  EmptyAdapter,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { OpenAI } from "openai";
import { NextRequest } from "next/server";

 
// You can use any service adapter here for multi-agent support.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const serviceAdapter = new OpenAIAdapter({openai});
 
const runtime = new CopilotRuntime({
  remoteEndpoints: [
    // Our CrewAI Flow endpoint URL
    { url: "http://localhost:8000/copilotkit" },
  ],
});
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
}; 