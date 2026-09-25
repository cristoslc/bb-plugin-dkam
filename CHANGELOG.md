# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Integration contract specs for all seven cross-context events
  (`docs/domain-architecture/events/*.yaml`) against the event-spec
  meta-schema, with contract-conformance tests (`npm test`, vitest) including
  the inverse malformed-spec test
- C4 component diagram and snapshot/drift sequence diagrams
- Initial scaffold: headless BB plugin (`bb-plugin-dkam`)
- `bb dkam status|watch|unwatch|recap` CLI
- `state_snapshot` agent tool (stubbed until agent-graph serves its HTTP endpoint)
- Settings: TTS API key (secret), operator mode, episode length
- Watch registry on plugin KV storage
- Project docs tree (architecture, domain model, ADRs) and developer workflows