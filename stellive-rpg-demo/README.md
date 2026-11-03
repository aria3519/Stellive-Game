# STELLAR QUEST - 2D Fan RPG Prototype

A standalone Next.js 15 local-play prototype. This is **not** a modification of the earlier CRPG studio because that project's source was not attached.

## Run on Windows

1. Install Node.js 20.9+.
2. Open a terminal in this extracted folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open http://localhost:3000/.

If port 3000 is in use, stop the other Next.js server first, or use `npm run dev -- -p 3001` and open http://localhost:3001/.

## Included

- Home / 3-member party builder / fixed story / world map / 2D turn-based battle
- 11 portrait crops from the reference image supplied in this conversation
- Per-character jobs, skill names, HP, attack, defense, ultimate charge
- Same-generation attack bonus (2 = +7%, 3 = +13%)
- Enemy retaliation, healing, shields, skill points, win/lose, 3 chapters, final boss
- Manual browser-local save and reset; no OpenAI API calls

## Important limitations

- Portraits are cropped from the supplied reference screenshot, not original game-ready character art. They include source framing and are **for local prototyping only**; secure the appropriate permissions before public distribution.
- Names and generation assignments are **placeholders** pending verification of official member identities and RP.
- The enemy is a CSS-drawn placeholder; story and combat balance are demo content.
- Ultimate skills charge through normal actions; 3-member party composition is required.
- Save data lives in the browser localStorage, not in a server database.

Edit `HEROES` and `CHAPTERS` in `app/page.tsx` to customize names, jobs, skills, and story. Replace `public/portraits/1.png` through `11.png` with approved art.
