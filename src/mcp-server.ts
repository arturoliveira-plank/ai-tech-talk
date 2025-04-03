import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import { generateCompletion } from "./providers/open-ai.js";
import path from "path";
// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});


const codeReviewPrompt = `
Please review this code:

{code}

Return a JSON Array of objects with the following fields:
- issue: a description of the issue found in the code
- suggestions: a string of suggestions for fixing the issue
- severity: the severity of the issue (low, medium, high)
- type: the type of the issue (bug, performance, security, code readability, code style, etc.)
- line: the line number of the issue
`

const codeGenerationPrompt = `
Please generate code for the following prompt:

{language}
{description}
{outputPath}

Return a JSON Array with the following fields:
  code: string;        // The generated code
  fileName: string;    // Name of the file to create
  explanation: string; // Description of the generated code
` 

server.tool("review-my-code",
  { filePath: z.string() },
  async ({ filePath }) => {
    try {
      // Read file directly without path restrictions
      const code = await fs.readFile(filePath, "utf-8");
      const review = await generateCompletion(codeReviewPrompt.replace('{code}', code));
      return { content: [{ type: "text", text: review }]};
    } catch (error: any) {
      return { 
        content: [{ 
          type: "text", 
          text: `Error reviewing code: ${error.message}` 
        }]
      };
    }
  }
);

server.tool("generate-code",
  { language: z.string(), description: z.string(), outputPath: z.string() },
  async ({ language, description, outputPath }) => {
    const code = await generateCompletion(codeGenerationPrompt.replace('{language}', language).replace('{description}', description).replace('{outputPath}', outputPath));
    return { content: [{ type: "text", text: code }]};
  }
);

export const runMcpServer = async () => {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runMcpServer();