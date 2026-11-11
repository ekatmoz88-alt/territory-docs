# PPO ID Docs — Architecture, Database, API and Source-Code Documentation

[English](README.en.md) | [Русский](README.md)

**Documentation website:** https://ekatmoz88-alt.github.io/territory-docs/

Technical documentation for PPO ID Docs, covering its logical architecture, Oracle information database, domain modules, source-code structure and API operations.

## Documentation sections

- [Architecture overview](./architecture/) — system context and boundaries, logical software components, Oracle data model, and operation-to-data mappings.
- [Database and data models](./database/index.md) — Oracle structure, CORE and DICT groups, domain modules, relationships and ER materials.
- [Source code and models](./source-code/index.md) — project structure, software components and code-to-database model mapping.
- [API operations](./api/index.md) — JSON operations, request fields, database mappings, validation and rollback behavior.

## Technology and documentation approach

- Oracle Database
- C# / .NET project structure
- SQL and JSON
- Markdown and VitePress
- Git, GitHub Actions and GitHub Pages
- Mermaid architecture diagrams

## Evidence and limitations

The materials are based on available project documentation and selected source-code excerpts. Architecture diagrams are logical views, not verified production deployment diagrams. API descriptions and field mappings do not prove that a live runtime endpoint is available or that an operation has been executed successfully.

The database inventory reports 401 tables. A separate physical-structure document contains 381 numbered entries; these figures belong to different documentary sources and are not interchangeable.

## Tags

`ppo-id-docs` · `oracle` · `database-documentation` · `system-architecture` · `api-documentation` · `docs-as-code`
