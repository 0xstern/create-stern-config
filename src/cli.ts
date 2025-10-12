#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as p from "@clack/prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PackageJson {
  scripts?: Record<string, string>;
  engines?: Record<string, string>;
  [key: string]: unknown;
}

const DEPENDENCIES = [
  "@eslint/js@^9.36.0",
  "@ianvs/prettier-plugin-sort-imports@^4.5.1",
  "eslint@^9.0.0",
  "eslint-config-prettier@^10.1.5",
  "eslint-plugin-import@^2.32.0",
  "eslint-plugin-jsdoc@^60.7.1",
  "eslint-plugin-n@^17.23.1",
  "globals@^15.0.0",
  "prettier@^3.0.0",
  "typescript-eslint@^8.45.0",
];

const SCRIPTS = {
  lint: "eslint .",
  "lint:fix": "eslint . --fix",
  format: "prettier --write .",
  "format:check": "prettier --check .",
};

const ENGINES = {
  node: ">=23.11.0",
};

type PackageManager = "bun" | "pnpm" | "yarn" | "npm";

function detectPackageManager(): PackageManager {
  if (fs.existsSync("bun.lockb")) return "bun";
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";
  if (fs.existsSync("package-lock.json")) return "npm";

  try {
    execSync("bun --version", { stdio: "ignore" });
    return "bun";
  } catch {
    return "npm";
  }
}

function getInstallCommand(pm: PackageManager): string {
  const deps = DEPENDENCIES.join(" ");
  switch (pm) {
    case "bun":
      return `bun add -d ${deps}`;
    case "pnpm":
      return `pnpm add -D ${deps}`;
    case "yarn":
      return `yarn add -D ${deps}`;
    default:
      return `npm install --save-dev ${deps}`;
  }
}

function copyTemplate(filename: string): boolean {
  const templatePath = path.join(__dirname, "..", "templates", filename);
  const targetPath = path.join(process.cwd(), filename);

  if (fs.existsSync(targetPath)) {
    p.log.warn(`${filename} already exists, skipping`);
    return false;
  }

  const content = fs.readFileSync(templatePath, "utf8");
  fs.writeFileSync(targetPath, content);
  return true;
}

function updatePackageJson(addScripts: boolean, addEngines: boolean): void {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    p.log.warn("No package.json found, skipping updates");
    return;
  }

  const packageJson: PackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8"),
  );

  if (addScripts) {
    packageJson.scripts = {
      ...packageJson.scripts,
      ...SCRIPTS,
    };
  }

  if (addEngines) {
    packageJson.engines = {
      ...packageJson.engines,
      ...ENGINES,
    };
  }

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );
}

async function main(): Promise<void> {
  console.clear();

  p.intro("Stern ESLint and Prettier Configuration");

  const pm = detectPackageManager();
  p.log.info(`Detected package manager: ${pm}`);

  const files = await p.multiselect({
    message: "Select configuration files to create:",
    options: [
      { value: "eslint", label: "ESLint Config (eslint.config.js)" },
      { value: "prettier", label: "Prettier Config (prettier.config.js)" },
      { value: "prettierignore", label: "Prettier Ignore (.prettierignore)" },
    ],
    initialValues: ["eslint", "prettier", "prettierignore"],
    required: true,
  });

  if (p.isCancel(files)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const updateScripts = await p.confirm({
    message: "Add lint/format scripts to package.json?",
    initialValue: true,
  });

  if (p.isCancel(updateScripts)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const updateEngines = await p.confirm({
    message: "Add engines to package.json?",
    initialValue: true,
  });

  if (p.isCancel(updateEngines)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const installDeps = await p.confirm({
    message: "Install dependencies now?",
    initialValue: true,
  });

  if (p.isCancel(installDeps)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const s = p.spinner();

  s.start("Creating configuration files");

  if (files.includes("eslint")) {
    copyTemplate("eslint.config.js");
  }

  if (files.includes("prettier")) {
    copyTemplate("prettier.config.js");
  }

  if (files.includes("prettierignore")) {
    copyTemplate(".prettierignore");
  }

  s.stop("Configuration files created");

  if (updateScripts || updateEngines) {
    s.start("Updating package.json");
    try {
      updatePackageJson(updateScripts, updateEngines);
      s.stop("package.json updated");
    } catch (error) {
      s.stop("Failed to update package.json");
      p.log.error("Could not update package.json automatically");
    }
  }

  if (installDeps) {
    s.start("Installing dependencies");

    try {
      execSync(getInstallCommand(pm), { stdio: "pipe" });
      s.stop("Dependencies installed");
    } catch (error) {
      s.stop("Failed to install dependencies");
      p.log.error("Failed to install dependencies");
      p.log.info(
        `You can install them manually with:\n  ${getInstallCommand(pm)}`,
      );
      process.exit(1);
    }
  }

  p.outro("Setup complete");

  if (installDeps && updateScripts) {
    console.log("\nAvailable commands:");
    console.log(`  ${pm} run lint          Check for linting errors`);
    console.log(`  ${pm} run lint:fix      Fix linting errors`);
    console.log(`  ${pm} run format        Format code with Prettier`);
    console.log(`  ${pm} run format:check  Check formatting\n`);
  }
}

main().catch((error) => {
  p.log.error("An error occurred");
  console.error(error.message);
  process.exit(1);
});
