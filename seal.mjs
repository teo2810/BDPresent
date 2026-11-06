import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const pdfPath = process.argv[2];
const htmlPath = process.argv[3];
if (!pdfPath || !htmlPath) {
  console.error("uso: node seal.mjs regalo.pdf index.html");
  process.exit(1);
}

const pdf = readFileSync(pdfPath);
if (!pdf.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
  console.error("il file non sembra un PDF");
  process.exit(1);
}
const key = randomBytes(16);
const sealed = Buffer.alloc(pdf.length);
for (let i = 0; i < pdf.length; i++) sealed[i] = pdf[i] ^ key[i % key.length];
const parts = [0, 1, 2, 3].map((part) => [...key.subarray(part * 4, part * 4 + 4)].join(", "));
const block = `/*VAULT_START*/
const VAULT = ${JSON.stringify(sealed.toString("base64"))};
const K0 = [${parts[0]}];
const K1 = [${parts[1]}];
const K2 = [${parts[2]}];
const K3 = [${parts[3]}];
/*VAULT_END*/`;

let html = readFileSync(htmlPath, "utf8");
if (!html.includes("/*VAULT_START*/") || !html.includes("/*VAULT_END*/")) {
  throw new Error("marcatori vault assenti in index.html");
}
html = html.replace(/\/\*VAULT_START\*\/[\s\S]*?\/\*VAULT_END\*\//, block);
writeFileSync(htmlPath, html);

const back = Buffer.from(sealed.toString("base64"), "base64");
const dec = Buffer.alloc(back.length);
for (let i = 0; i < back.length; i++) dec[i] = back[i] ^ key[i % key.length];
if (!dec.equals(pdf)) throw new Error("roundtrip fallito");
console.log(`sigillato ${pdf.length} byte, PDF in chiaro non scritto`);
