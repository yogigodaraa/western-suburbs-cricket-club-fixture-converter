# Copilot instructions for the WSCC fixture converter

- **Main app:** `wscc-web/`, Next.js 15 + TypeScript. The conversion logic is in `src/utils/fixtureConverter.ts` and `teamMapping.ts`; API routes are in `src/app/api/convert/`. `npm ci`, `npm run typecheck`, `npm run build`.
- **Python converter:** `wscc_fixtures/wscc_fixtures/` (Flask UI + CLI) mirrors the same rules. `pip install -r wscc_fixtures/requirements.txt`, then `pytest` and `ruff check .` from `wscc_fixtures/`.
- **Keep both converters in sync.** Event names and descriptions put WSCC first (`"<WSCC team> vs <opponent>"`). Team-name normalisation lives in both `teamMapping.ts` and `team_mapping.py`.
- **Data:** the fixture CSVs are public match fixtures. Never commit member lists, contact details or generated output (`tmp/`).
