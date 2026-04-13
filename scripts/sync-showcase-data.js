"use strict"

const fs = require("fs")
const path = require("path")

const V0_ROOT = path.resolve(__dirname, "..")
const PUBLIC_DIR = path.resolve(V0_ROOT, "public")
const PUBLIC_COVERS_DIR = path.resolve(PUBLIC_DIR, "showcase-covers")
const OUTPUT_FILE = path.resolve(PUBLIC_DIR, "showcase-data.json")

function main() {
  const nebrisRoot = resolveNebrisRoot(process.argv[2])
  const sourceFile = path.resolve(nebrisRoot, "output", "showcase", "showcase-data.json")

  if (!fs.existsSync(sourceFile)) {
    throw new Error(`未找到源文件: ${sourceFile}`)
  }

  ensureDir(PUBLIC_DIR)
  ensureDir(PUBLIC_COVERS_DIR)

  const payload = JSON.parse(fs.readFileSync(sourceFile, "utf8"))
  const transformed = {
    ...payload,
    synced_at: new Date().toISOString(),
    source_path: sourceFile,
    cases: Array.isArray(payload.cases)
      ? payload.cases.map((item) => transformCase(item))
      : [],
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(transformed, null, 2), "utf8")
  console.log(`showcase 数据已同步: ${OUTPUT_FILE}`)
  console.log(`案例数: ${transformed.cases.length}`)
}

function transformCase(item) {
  const coverUrl = item && item.output ? item.output.cover_url : ""
  const syncedCover = syncCoverAsset(coverUrl)
  return {
    ...item,
    output: {
      ...(item.output || {}),
      cover_url: syncedCover || "/placeholder.jpg",
    },
  }
}

function syncCoverAsset(coverPath) {
  const normalized = asString(coverPath)
  if (!normalized) {
    return ""
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized
  }

  if (!path.isAbsolute(normalized)) {
    return normalized.startsWith("/") ? normalized : `/${normalized.replace(/^\/+/, "")}`
  }

  if (!fs.existsSync(normalized)) {
    return ""
  }

  const fileName = sanitizeFileName(path.basename(normalized))
  const targetPath = path.resolve(PUBLIC_COVERS_DIR, fileName)

  fs.copyFileSync(normalized, targetPath)
  return `/showcase-covers/${fileName}`
}

function resolveNebrisRoot(cliValue) {
  const envValue = asString(process.env.NEBRIS_ENGINE_DIR)
  if (envValue) {
    return envValue
  }
  if (asString(cliValue)) {
    return path.resolve(cliValue)
  }
  return path.resolve(V0_ROOT, "..", "nebris-engine")
}

function sanitizeFileName(value) {
  return asString(value).replace(/[^a-zA-Z0-9._-]/g, "-")
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function asString(value) {
  if (value === null || value === undefined) {
    return ""
  }
  return String(value).trim()
}

main()
