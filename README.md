# MCP Server Setup Guide

This guide explains how to set up and use the MCP (Model Context Protocol) server with Cursor.

## Prerequisites

- Node.js installed
- Cursor editor installed
- OpenAI API key

## Setup Instructions

1. **Install Dependencies**
```bash
npm install 
```

2. **Configure MCP Server**
Click on Cursor - > Settings -> Cursor Settings -> MCP - Add MCP Server

Use the JSON bellow to enable your MCP Server
```json
{
    "mcpServers": {
        "github": {
            "command": "node",
            "args": ["path/to/your/mcp-server.js"],
            "env": {
                "OPENAI_API_KEY": "your-api-key-here"
            }
        }
    }
}
```

## Available Tools

### Code Review Tool
Reviews code files and provides suggestions for improvements.

Usage:
```typescript
// Review a code file
review-my-code "/path/to/your/code.ts"
```

## Development

1. **Build the Project**
```bash
npm run build
```

2. **Watch for Changes**
```bash
npm run watch
```

## Using with Cursor

1. Open you updated Cursor editor
2. Use the command palette (Cmd/Ctrl + I)
3. Start interacting with the MCP server
4. With the Agent option enable ask for code review an pass the absolute path of the file


## Hands-on exercise:

- Create a new tool fot code generation, it should receive the following parameters:

- Code Language: typescript, python, java, etc...
- Descrition of the implmentation you want
- Path Output to create the files tha it will generates


1 - You must create a prompt to explain to your LLM model what to do and use the same info you reveive. The prompt must return a array of object an the object must have the code, the name of the file and the explanation of the generated code. 
2 - Make the LLM call passing your prompt and evaluate the results
3 - Create the files the LLM will return to you

