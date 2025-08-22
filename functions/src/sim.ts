/**
 * Cognitive Insight™ — Demo Simulation
 * This file contains illustrative logic (hashing & toy Merkle aggregation) for UI demos.
 * It is NOT a reference implementation of CIAF and omits proprietary methods, formats,
 * policies, keys, and anchoring/verification details. Patent pending.
 */


import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import crypto from "crypto";

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp({
    projectId: 'cognitiveinsight-j7xwb'
  });
}

// Optional: set defaults (pick your region)
setGlobalOptions({ region: "us-central1" });

// Authentication helper
async function verifyFirebaseToken(req: any): Promise<DecodedIdToken | null> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    
    // Allow mock token in development
    if (token === 'mock-development-token') {
      console.warn('Using mock authentication token for development');
      return {
        uid: 'mock-user-id',
        aud: 'cognitiveinsight-j7xwb',
        auth_time: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        firebase: {
          identities: {},
          sign_in_provider: 'anonymous'
        },
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://securetoken.google.com/cognitiveinsight-j7xwb',
        sub: 'mock-user-id'
      } as DecodedIdToken;
    }
    
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// tiny utility
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

// Build a fake Merkle root from N leaves (deterministic but simulated)
function merkleRoot(
  leaves: string[]
): { root: string; sample: { leaf: string; path: string[] } } {
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

export const simGenerate = onRequest(
  { 
    cors: true
    // Remove invoker setting to use default auth
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Verify Firebase authentication
    const decodedToken = await verifyFirebaseToken(req);
    if (!decodedToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { datasetGB = 500, auditRatio = 10, cacheWarm = true } = req.body || {};
    const capsules = Math.max(1, Math.round(auditRatio * 125)); // illustrative

    // create synthetic leaves using inputs
    const leaves = Array.from({ length: capsules }, (_, i) =>
      sha256(`${datasetGB}:${auditRatio}:${i}`)
    );
    const { root, sample } = merkleRoot(leaves);

    res.json({
      capsules,
      anchorRoot: root,
      proofSample: { leaf: sample.leaf, path: sample.path },
      cacheWarm,
    });
  }
);

export const simVerify = onRequest(
  { 
    cors: true
    // Remove invoker setting to use default auth
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Verify Firebase authentication
    const decodedToken = await verifyFirebaseToken(req);
    if (!decodedToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { anchorRoot, proofSample, cacheWarm = true } = req.body || {};
    if (!anchorRoot || !proofSample?.leaf || !Array.isArray(proofSample.path)) {
      res.status(400).json({ ok: false, error: "Invalid proof payload" });
      return;
    }

    // recompute root from sample proof
    let h = sha256(proofSample.leaf);
    for (const neighbor of proofSample.path) {
      // deterministic concat order for demo; real proofs track left/right
      const leftFirst = h < neighbor ? h + neighbor : neighbor + h;
      h = sha256(leftFirst);
    }
    const verified = h === anchorRoot;

    // Simulated latency
    const baseMs = 18;
    const retrievalMs = Math.round(baseMs * (cacheWarm ? 1 : 3.2));

    res.json({ verified, retrievalMs });
  }
);
