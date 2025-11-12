
# MegaBlog (React + Appwrite)

A modern blogging platform built with React, Vite, Redux Toolkit, and Appwrite for authentication, database, and file storage. Features a TinyMCE rich text editor, optional featured images, and a Tailwind-based responsive UI.

## Highlights
- Create, edit, delete blog posts
- TinyMCE rich text editor
- Optional featured image uploads (Appwrite Storage)
- Public / inactive post status
- Image previews with SVG fallback to avoid broken images

## Quickstart

Prerequisites
- Node.js 18+ (or compatible)
- Appwrite server (self-hosted or Appwrite Cloud)

Local setup
1. Clone and enter the project

```bash
git clone https://github.com/raiyansyed/ReatBlog.git
cd ReatBlog/12MegaBlog
```

2. Install dependencies

```bash
npm install
```

3. Environment variables

Create a `.env` file (copy from any example or create new) and set the following values with the actual IDs from your Appwrite Console:

```env
VITE_APPWRITE_URL=https://your-appwrite.example.com/v1
VITE_APPWRITE_PROJECT_ID=xxxxxxxxxxxxxxxxxxxx
VITE_APPWRITE_DATABASE_ID=yyyyyyyyyyyyyyyyyyyy
VITE_APPWRITE_COLLECTION_ID=zzzzzzzzzzzzzzzzzzzz  # collection ID (NOT the collection name)
VITE_APPWRITE_BUCKET_ID=bbbbbbbbbbbbbbbbbbbb     # storage bucket ID (NOT the bucket name)
```

Notes:
- `VITE_APPWRITE_COLLECTION_ID` must be the collection ID (UUID-like) — not its display name.
- `VITE_APPWRITE_BUCKET_ID` must be the bucket ID used for storing featured images.

4. Start dev server

```bash
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

## Appwrite Setup Details

Collection schema (recommended fields)
- `title` (string)
- `slug` (string, unique)
- `content` (string)
- `status` (enum: `active` / `inactive`)
- `authorId` (string)
- `featuredImage` (string, optional file ID)

Storage / Buckets
- The app uploads files with a `read: any` permission by default. This allows `<img>` tags to fetch previews without requiring an authenticated session. If your bucket or files are private, previews will 404 or fall back to the SVG placeholder.

Two approaches for public previews:
- Make the bucket public (File Security: Disabled) — simplest for public blogs.
- Keep bucket secure and set per-file read permissions to `any` (the app now does this for new uploads).

If an older file was uploaded before this change, edit its permissions in Appwrite Console or re-upload it via the edit-post form.

## Useful NPM scripts
- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle
- `npm run preview` — locally preview build
- `npm run lint` — run ESLint

## Debugging & Troubleshooting

Image preview troubleshooting
1. Is the post showing `featuredImage` in the document? If yes, note the file ID (for example: `691450f400341a0125a1`).
2. In the browser console the app logs preview URLs (see `PostCard` and `Post` components). Copy the URL and open it directly — you should get the image or a 401/403/404.
3. If you see 403/401/404:
   - Confirm `VITE_APPWRITE_BUCKET_ID` is correct in `.env`.
   - In Appwrite Console → Storage → Bucket → File, check the file permissions. If private, add `read: any` or re-upload the file.
4. Re-upload a file from the edit form — code uploads with public read permission by default now.

Common pitfalls
- Wrong IDs in `.env` (using names instead of IDs)
- Browser caching — clear or use an incognito window while testing permissions

## Code map
- `src/appwrite/config.js` — central Appwrite client and helpers (create/update/delete posts, file upload, getFilePreview/getFileView)
- `src/components/post-form/PostForm.jsx` — post creation/edit form
- `src/pages/Post.jsx` — single-post view with image preview fallback

## Contributing
- Fork, add a branch for your changes, and open a PR with a clear description.

## License
MIT
