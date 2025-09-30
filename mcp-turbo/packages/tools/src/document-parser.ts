export async function parseDocument(text: string) {
  const extracted: Record<string, string> = {};

  const idMatch = text.match(/\b(\d{6,20})\b/);
  if (idMatch) extracted["id_number"] = idMatch[1];

  const dobMatch = text.match(/\b(\d{2}[\/\-\.\s]\d{2}[\/\-\.\s]\d{2,4})\b/);
  if (dobMatch) extracted["dob"] = dobMatch[1];

  return {
    ocr_text: text,
    extracted,
    confidence: 0.7
  };
}
