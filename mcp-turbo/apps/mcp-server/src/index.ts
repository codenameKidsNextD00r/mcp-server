import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { parseDocument, verifyIdentity } from "@mcp-kyc/tools";

const app = express();
app.use(express.json());

const documents: Record<string, any> = {};
const verifications: Record<string, any> = {};

function mkResp(tool: string, payload: any) {
  return { mcp_request_id: uuidv4(), status: "ok", tool, payload };
}

app.post("/mcp/v1/tools/document-parser/parse", async (req: Request, res: Response) => {
  const { text } = req.body;
  const result = await parseDocument(text);
  const docId = uuidv4();
  documents[docId] = { id: docId, extracted: result };
  res.json(mkResp("document-parser", { documentId: docId, ...result }));
});

app.post("/mcp/v1/tools/identity-verifier/verify", async (req: Request, res: Response) => {
  const { documentId, extracted, selfieBase64 } = req.body;
  const doc = documentId ? documents[documentId]?.extracted : extracted;
  const result = await verifyIdentity({ extracted: doc, selfieBase64 });
  const verificationId = uuidv4();
  verifications[verificationId] = { id: verificationId, result };
  res.json(mkResp("identity-verifier", { verificationId, ...result }));
});

app.listen(3000, () => console.log("MCP KYC Server running on port 3000"));
