interface VerifyInput {
  extracted?: Record<string, string>;
  selfieBase64?: string;
}

export async function verifyIdentity({ extracted, selfieBase64 }: VerifyInput) {
  if (!extracted) {
    return { verdict: "manual_review", reasons: ["no_data"], score: 0.2 };
  }

  let score = 0;
  const reasons: string[] = [];

  if (extracted["id_number"]) score += 0.4;
  else reasons.push("missing_id_number");

  if (extracted["dob"]) score += 0.2;

  if (selfieBase64) {
    const faceScore = 0.5 + Math.random() * 0.4;
    score += 0.2 * faceScore;
    if (faceScore < 0.6) reasons.push("low_face_match");
  }

  const verdict = score >= 0.6 ? "verified" : score >= 0.4 ? "manual_review" : "unverified";

  return { verdict, reasons, score: Number(score.toFixed(2)) };
}
