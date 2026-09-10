# Incremental API blocking program

Admin Center prototype for **API configuration** → Incremental API partner extensions.

## Versions

Use the prototype header switcher:

- **Version 1** — Add partners via checkbox list in a modal
- **Version 2** — Add partners via Garden searchable multiselect Combobox (25 partners, removable tags)

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://127.0.0.1:5173/`).

## Notes for reviewers

- Enable **Incremental API partner extensions**, then use **Add partners**
- After at least one partner is saved, that checkbox stays on and becomes disabled
- Refresh clears partner data (session-only state)
- Comment mode is available from the prototype header

## Stack

- React 18 + Vite
- Zendesk GlobalNav template
- Garden v9 (forms, tables, modals, notifications, dropdowns)
