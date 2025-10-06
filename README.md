# SL-NASA-KNOWLEDGE-ENGINE

SL-NASA-KNOWLEDGE-ENGINE is an experimental web application and demonstration of LABI — an AI-powered, Retrieval-Augmented Generation (RAG) search engine grounded in a curated corpus of 608 NASA bioscience publications. The platform turns a large, heterogeneous body of space bioscience literature into an interactive knowledge engine so researchers can ask natural-language questions and receive answers that are supported by the NASA corpus (no hallucinations).

This repository hosts the frontend for the project — a Next.js app that provides the user interface for LABI, including a left-side sidebar and a chat-style query interface.

## Demo & Project links

- Project demo (presentation): [Canva presentation](https://www.canva.com/design/DAG07k4RDdo/hFb0Pd2zLiUTt9w2yzaWbw/edit?utm_content=DAG07k4RDdo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- Project organization: [SL-NASA-Knowledge-Engine GitHub org](https://github.com/SL-NASA-Knowledge-Engine)
- Backend repository: [SL-NASA-Knowledge-Engine-Backend](https://github.com/SL-NASA-Knowledge-Engine/SL-NASA-Knowledge-Engine-Backend)

## What is LABI Search Engine?

LABI is a domain-specific AI assistant and search engine designed for space bioscience research. It uses a RAG Graph architecture to:

- Structure 608 NASA bioscience publications into a multi-dimensional knowledge graph (Neo4j) and vector indexes for semantic search.
- Ground model responses only in the curated NASA corpus so answers are evidence-based and attribution-ready.
- Allow natural-language queries to discover relationships across studies, compare experimental results, and surface trends or contradictions within the dataset.

The result: literature review and hypothesis generation that typically takes weeks can be reduced to minutes with interactive, traceable AI-driven exploration.

## High-level architecture

- Frontend: Next.js app (this repo) — React components, global CSS, and a chat UI (LABI) that calls a local API proxy.
- Backend (repo above): Python services (FastAPI) that ingest, process, and index the 608 NASA publications into:
  - A Neo4j knowledge graph (structured relationships and metadata).
  - One or more vector databases (semantic embeddings for retrieval).
- RAG Graph: the system queries the vector store for relevant passages, maps results into the knowledge graph context, and uses an LLM to synthesize answers grounded on retrieved evidence.

## Key features in this frontend

- Chat UI component (`app/components/Chat.tsx`) with typing indicator, input controls (mic/attach/send), and client-side linkification of PMC identifiers and URLs.
- Server-side proxy endpoint at `app/api/query/route.ts` that forwards user queries to the research backend (avoids CORS from browser-to-remote calls).
- Sidebar navigation and placeholder components that show upcoming features (dashboard, library).
- Lightweight global CSS variables for consistent colors and spacing.

## Running the frontend locally

Requirements:
- Node.js (recommended 18.x or later compatible with your Next.js version)
- npm (or yarn/pnpm)

Steps:

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
npm run start
```

Open http://localhost:3000 in your browser.

If the chat cannot call the external research backend due to CORS, the frontend is configured to talk to a local server-side proxy `/api/query` which will forward requests server-to-server.

## Data

- Corpus: 608 NASA bioscience publications (indexed and processed by the backend pipeline).
- The frontend expects the API response shape to include an `answer` string. The server proxy handles JSON parsing and error forwarding.

## Development notes

- To change the welcome message or initial conversation, edit the `messages` initial state in `app/components/Chat.tsx`.
- The function `linkifyText` in `app/components/Chat.tsx` converts `PMC` identifiers and http(s) URLs into safe clickable links.
- Icons are provided via `lucide-react`. If you see peer dependency warnings while installing, try `npm install --legacy-peer-deps` (for local development only).

## Security and attribution

- LABI is intentionally grounded in the NASA corpus; the backend ensures answers include supporting passages and references to avoid hallucinations. Review the backend implementation for how evidence is attached to generated answers.
- When deploying, secure any backend credentials (API keys, database credentials) using environment variables and secret storage provided by your cloud provider.

## Contributing

Contributions are welcome. Typical workstreams include:
- Improving the linkification and reference rendering in the chat UI.
- Adding robust error handling and retry strategies for backend failures.
- Implementing streaming responses for progressive answer rendering.
- Building the dashboard and library views to explore the knowledge graph.

Please open issues or pull requests at: [SL-NASA-Knowledge-Engine GitHub org](https://github.com/SL-NASA-Knowledge-Engine)

## Credits

This project assembled multiple AI tools during development: NotebookLM and Perplexity for literature analysis, Copilot for code suggestions, Claude and ChatGPT for drafting and prototyping. The platform integrates structured knowledge (Neo4j), vector search, and LLM synthesis to create LABI.