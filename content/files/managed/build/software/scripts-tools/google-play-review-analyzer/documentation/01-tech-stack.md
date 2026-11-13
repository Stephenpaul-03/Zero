# Google Play Review Analyzer — Tech stack

## Technical foundation

Python 3.11+ drives the pipeline, with google-play-scraper and requests. Ollama provides the local model. The dashboard uses React, TypeScript, Vite, Tailwind, and Recharts; its README asks for Node 20+.

## Repository map

| Path | Purpose |
| --- | --- |
| sources/ | Review-source adapters |
| engines/ | Classification-engine adapters |
| web/ | React dashboard |
| docs/data-contract.md | Contract between generated data and dashboard |

## Documentation sources

Prepared from the local repository README, package manifests, and the listed source folders on 13 November 2026.

- [Source repository](https://github.com/Stephenpaul-03/Google-Play-Review-Analyzer)
- [README at the inspected revision](https://github.com/Stephenpaul-03/Google-Play-Review-Analyzer/blob/0989fe0c7833229375eb79adec05b52ae7e51a7c/README.md)
