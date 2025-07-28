#!/usr/bin/env node

/**
 * Security Check Script
 * Run this script to perform basic security checks on your project
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("🔒 Running Security Checks...\n");

// Check 1: Environment file security
function checkEnvironmentFiles() {
  console.log("1. Checking environment files...");

  const envFiles = [
    ".env.local",
    ".env",
    ".env.development",
    ".env.production",
  ];
  let hasIssues = false;

  envFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");

      // Check for real API keys (common patterns)
      const dangerousPatterns = [
        /AIza[0-9A-Za-z_-]{35}/g, // Google API keys
        /sk-[a-zA-Z0-9]{48}/g, // OpenAI keys
        /xoxb-[0-9]+-[0-9]+-[0-9]+-[a-z0-9]+/g, // Slack tokens
      ];

      dangerousPatterns.forEach((pattern) => {
        if (pattern.test(content)) {
          console.log(
            `   ❌ ${file} contains what appears to be a real API key!`
          );
          hasIssues = true;
        }
      });

      // Check for placeholder values
      if (content.includes("your_") || content.includes("YOUR_")) {
        console.log(`   ✅ ${file} contains safe placeholder values`);
      } else if (!hasIssues) {
        console.log(
          `   ⚠️  ${file} may contain real values - ensure they're not committed`
        );
      }
    }
  });

  if (!hasIssues) {
    console.log("   ✅ Environment files check passed\n");
  } else {
    console.log("   ❌ Environment files have security issues!\n");
  }

  return !hasIssues;
}

// Check 2: Dependency vulnerabilities
function checkDependencies() {
  console.log("2. Checking for dependency vulnerabilities...");

  try {
    execSync("pnpm audit --audit-level=moderate", { stdio: "pipe" });
    console.log("   ✅ No vulnerabilities found\n");
    return true;
  } catch (error) {
    console.log('   ❌ Vulnerabilities found! Run "pnpm audit" for details\n');
    return false;
  }
}

// Check 3: Git security
function checkGitSecurity() {
  console.log("3. Checking git security...");

  let hasIssues = false;

  // Check if .env files are tracked
  try {
    const trackedFiles = execSync("git ls-files", { encoding: "utf8" });
    const envFilesTracked = trackedFiles
      .split("\n")
      .filter((file) => file.startsWith(".env") && file !== ".env.example");

    if (envFilesTracked.length > 0) {
      console.log(
        `   ❌ Environment files are tracked in git: ${envFilesTracked.join(
          ", "
        )}`
      );
      hasIssues = true;
    }
  } catch (error) {
    console.log("   ⚠️  Not a git repository or git not available");
  }

  // Check .gitignore
  if (fs.existsSync(".gitignore")) {
    const gitignore = fs.readFileSync(".gitignore", "utf8");
    const requiredPatterns = ["*.local", ".env", "*.key", "*.pem"];

    requiredPatterns.forEach((pattern) => {
      if (!gitignore.includes(pattern)) {
        console.log(`   ⚠️  .gitignore missing pattern: ${pattern}`);
      }
    });
  }

  if (!hasIssues) {
    console.log("   ✅ Git security check passed\n");
  } else {
    console.log("   ❌ Git security issues found!\n");
  }

  return !hasIssues;
}

// Check 4: Security headers
function checkSecurityHeaders() {
  console.log("4. Checking security configuration...");

  let hasIssues = false;

  // Check .htaccess
  if (fs.existsSync(".htaccess")) {
    const htaccess = fs.readFileSync(".htaccess", "utf8");
    const requiredHeaders = [
      "X-Content-Type-Options",
      "X-Frame-Options",
      "X-XSS-Protection",
      "Content-Security-Policy",
    ];

    requiredHeaders.forEach((header) => {
      if (!htaccess.includes(header)) {
        console.log(`   ⚠️  .htaccess missing security header: ${header}`);
        hasIssues = true;
      }
    });

    if (!hasIssues) {
      console.log("   ✅ Security headers found in .htaccess");
    }
  } else {
    console.log("   ⚠️  No .htaccess file found");
    hasIssues = true;
  }

  if (!hasIssues) {
    console.log("   ✅ Security headers check passed\n");
  } else {
    console.log("   ⚠️  Some security configuration issues found\n");
  }

  return !hasIssues;
}

// Run all checks
async function runSecurityChecks() {
  const results = [
    checkEnvironmentFiles(),
    checkDependencies(),
    checkGitSecurity(),
    checkSecurityHeaders(),
  ];

  const passed = results.filter(Boolean).length;
  const total = results.length;

  console.log("📊 Security Check Summary:");
  console.log(`   Passed: ${passed}/${total} checks`);

  if (passed === total) {
    console.log("   🎉 All security checks passed!");
    process.exit(0);
  } else {
    console.log("   ⚠️  Some security issues found. Please review and fix.");
    console.log("   📖 See SECURITY.md for detailed security guidelines.");
    process.exit(1);
  }
}

// Run the checks
runSecurityChecks().catch((error) => {
  console.error("Error running security checks:", error);
  process.exit(1);
});
