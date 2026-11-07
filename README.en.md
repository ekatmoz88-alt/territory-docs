# PPO Territory — Database, API and Source-Code Documentation

[English](README.en.md) | [Русский](README.md)

**Documentation website:** https://ekatmoz88-alt.github.io/territory-docs/

Supplementary technical documentation for PPO Territory, focused on the Oracle information database, domain modules, source-code structure and API materials.

## Project boundary

This repository provides a supplementary documentation set for PPO Territory and complements the [PPO Territory technical archive](https://github.com/ekatmoz88-alt/ppo-territory-archive). Passport and migration accounting are documented as functional domains within PPO Territory, not as separate products. ARM Descriptor is a separate documentation subject.

## Documentation sections

- [Database and data models](./database/index.md) — Oracle structure, CORE and DICT groups, domain modules, relationships and ER views.
- [Source code and models](./source-code/index.md) — project structure, software modules and code-to-database model mapping.
- [API operations](./api/index.md) — JSON operations, request fields, database mappings, validation and rollback behavior.

## Evidence and limitations

The materials combine project documentation and inspected source-code excerpts. API operations and field mappings should be treated as documentation-level analysis unless independently confirmed by an executable service or test evidence. The Oracle inventory reports 401 tables; a separate 2014 physical-structure document contains 381 numbered entries, which is a different source and should not be conflated with the 401-table inventory.

## Tags

`ppo-territory` · `oracle` · `database-documentation` · `api-documentation` · `source-code-analysis`
