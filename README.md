# Lukis (frontend)

Lukis is a hand-drawn whiteboard built on [Excalidraw](https://github.com/excalidraw/excalidraw).
It adds the product side Excalidraw leaves out: accounts, a saved list of
drawings, workspaces with roles, live collaboration, version history, share
links and a trash.

Lukis is split into three repositories:

| Repo | What it is |
| --- | --- |
| [lukis-front](https://github.com/Isma27K/lukis-front) (this one) | Next.js 16 app: dashboard, editor, account and admin pages |
| [lukis-backend](https://github.com/Isma27K/lukis-backend) | FastAPI + MongoDB API, live-collaboration relay, and the Docker Compose stack for deploying |
| [lukis-editor](https://github.com/Isma27K/lukis-editor) | Our Excalidraw fork (the `lukis` branch), built into this app |

## Running it locally

You need Node 24, yarn 1 (for the editor build) and a running
[backend](https://github.com/Isma27K/lukis-backend) on `http://localhost:8000`.

Clone the repos next to each other, so this one can find the editor at
`../excalidraw`:

```sh
git clone https://github.com/Isma27K/lukis-front.git frontend
git clone https://github.com/Isma27K/lukis-backend.git backend
git clone -b lukis https://github.com/Isma27K/lukis-editor.git excalidraw
```

Then build the editor and start the app:

```sh
cd frontend
npm run excalidraw:build   # builds ../excalidraw into vendor/ and installs deps
npm run dev                # http://localhost:3000
```

`npm run excalidraw:build` packs the editor into `vendor/excalidraw/*.tgz` and
copies its fonts into `public/fonts/`. Both are gitignored, so a fresh checkout
needs it before `npm install` works. Set `BACKEND_URL` if the backend isn't on
`http://localhost:8000`.

The first account you register becomes the site owner. On a fresh database it
needs the one-time setup code the backend prints to its logs.

## Scripts

```sh
npm run dev         # development server
npm run build       # production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit (after a build, which generates route types)
npm run format      # prettier
```

## Deploying

The Docker Compose stack (Caddy, frontend, backend, MongoDB, daily backups)
and its guide live in the backend repo, under
[`deploy/`](https://github.com/Isma27K/lukis-backend/tree/main/deploy).

## License

[MIT](LICENSE). The editor is Excalidraw, also MIT; Excalifont in `app/fonts/`
is under the SIL Open Font License (see `app/fonts/excalifont-LICENSE.txt`).
