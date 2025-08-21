import * as functions from "firebase-functions";
import crypto from "crypto";

// tiny utility
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

// Build a fake Merkle root from N leaves (deterministic but simulated)
function merkleRoot(leaves: string[]): { root: string; sample: { leaf: string; path: string[] } } {
  if (leaves.length === 0) return { root: sha256("empty"), sample: { leaf: "", path: [] } };
  let level = leaves.map((x) => sha256(x));
  const sampleIdx = Math.min(2, level.length - 1);
  const samplePath: string[] = [];
  let idx = sampleIdx;

  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = i + 1 < level.length ? level[i + 1] : left;
      const parent = sha256(left + right);
      next.push(parent);
      // record neighbor for proof
      if (i === idx || i + 1 === idx) {
        const neighbor = i === idx ? right : left;
        samplePath.push(neighbor);
        idx = Math.floor(i / 2);
      }
    }
    level = next;
  }
  return { root: level[0], sample: { leaf: leaves[sampleIdx], path: samplePath } };
}

export const simGenerate = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).send();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { datasetGB = 500, auditRatio = 10, cacheWarm = true } = req.body || {};
  const capsules = Math.max(1, Math.round(auditRatio * 125)); // illustrative
  // create synthetic leaves using inputs
  const leaves = Array.from({ length: capsules }, (_, i) =>
    sha256(`${datasetGB}:${auditRatio}:${i}`)
  );
  const { root, sample } = merkleRoot(leaves);

  return res.json({
    capsules,
    anchorRoot: root,
    proofSample: { leaf: sample.leaf, path: sample.path },
    cacheWarm,
  });
});

export const simVerify = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).send();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { anchorRoot, proofSample, cacheWarm = true } = req.body || {};
  if (!anchorRoot || !proofSample?.leaf || !Array.isArray(proofSample.path)) {
    return res.status(400).json({ ok: false, error: "Invalid proof payload" });
  }
  // recompute root from sample proof
  let h = sha256(proofSample.leaf);
  for (const neighbor of proofSample.path) {
    // deterministic concat order for demo; real proofs track left/right
    const leftFirst = h < neighbor ? (h + neighbor) : (neighbor + h);
    h = sha256(leftFirst);
  }
  const verified = h === anchorRoot;

  // Simulated latency
  const baseMs = 18;
  const retrievalMs = Math.round(baseMs * (cacheWarm ? 1 : 3.2));

  return res.json({ verified, retrievalMs });
});
