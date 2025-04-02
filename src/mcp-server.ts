import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import { generateCompletion } from "./providers/open-ai.js";
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


// Add an addition tool
server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `Hello, ${name}!`
    }]
  })
);

server.prompt(
  "review-code",
  { code: z.string() },
  ({ code }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please review this code:\n\n${code}`
      }
    }]
  })
);

export const runMcpServer = async () => {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runMcpServer();