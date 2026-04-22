import { cp, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "..")
const sourceDir = path.join(repoRoot, "images")
const targetDir = path.join(process.cwd(), "public", "images")

async function exists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function main() {
  if (!(await exists(sourceDir))) return
  await mkdir(targetDir, { recursive: true })
  await cp(sourceDir, targetDir, { recursive: true, force: true })
}

await main()
