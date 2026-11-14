# Documentation Security & Data Sanitization Guidelines (`SECURITY.md`)

**Target:** Public documentation repository (`territory-docs`) describing an internal enterprise system (Oracle DB, C#/.NET, JSON API).

When reviewing Pull Requests, strictly enforce data sanitization and infrastructure security rules:

## 1. Corporate Infrastructure & Confidentiality Boundaries
- **No Internal Network Details:** Flag any real internal IP addresses, private hostnames, internal domain names, server paths, or non-public VPN/office server endpoints. Use sanitized placeholders (e.g., `<internal-host>`, `10.x.x.x`).
- **No Secrets or Credentials:** Ensure no Oracle DB connection strings, passwords, API keys, JWT tokens, certificates, or service account names are present in Markdown files, JSON examples, or `.github/workflows`.
- **Sanitized Examples:** Verify that all JSON payloads, SQL queries, and IDs use synthetic/anonymized data rather than real production records or personally identifiable information (PII).

## 2. CI/CD & VitePress Deployment Security (`.github/workflows`)
- **Least Privilege:** Ensure GitHub Actions workflows for VitePress / GitHub Pages use minimal required permissions (`permissions: contents: read`, `pages: write`) and pinned action versions.
- **No Secret Leakage in Build Logs:** Flag any workflow steps that echo environment variables or debug secrets during static site generation.

## 3. Reporting Security Issues
- If you identify exposed internal infrastructure details, credentials, or sensitive production data in this public repository, please notify the maintainer (`@ekatmoz88-alt`) immediately via private contact before opening a public issue.
