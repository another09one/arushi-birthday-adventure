# The Main Character — Arushi 🎂

A cinematic birthday adventure with a 3D explorable island, a customizable Arushi avatar, animated party guests, collectible stars, interactive buildings, a short photo film, full-frame gallery, birthday cake, mini-games, a wish wall, and original instrumental soundtracks.

## Run it locally

No build tools or package installation are needed.

1. Download/clone this repository.
2. Start VS Code's **Live Server** extension and open the local site. (The 3D scene uses Three.js as an ES module from a CDN, so it needs an internet connection and should be served over localhost rather than opened as a `file://` page.)
3. Keep the `assets`, `css`, and `js` folders beside `index.html`.

## Publish on GitHub Pages

1. Sign in to GitHub and create a new **Public** repository, for example `arushi-birthday`.
2. Upload the *contents of this folder* to the repository root. `index.html` must be at the top level, not inside another nested folder.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then press **Save**.
6. Wait for GitHub Pages to publish. Your site will appear at `https://YOUR-USERNAME.github.io/arushi-birthday/`.

If you update the site later, commit/push the changed files to the same branch. GitHub Pages will redeploy automatically.

## What's inside

- Cinematic intro and six-scene photo film
- 15-photo gallery with full-image viewing (images use `object-fit: contain` to avoid cutting off faces)
- Animated virtual birthday crowd and party mode
- Birthday cake candle interaction and confetti
- Playable 3D island adventure powered by Three.js: walk Arushi around the island with WASD/arrow keys or mobile controls, drag to look around, jump, and change her outfit between lilac, rose and mint
- Four explorable buildings, animated guest characters, a central birthday cake stage, glowing lamps, trees, clouds, a secret gate and six collectible stars
- Proximity interactions with locations and party guests; collect all six stars to unlock the secret-gate message and birthday letter
- Four location discoveries with personal messages, photo moments and links into the birthday experience
- Five-star wish quest
- Balloon Rush, Memory Match, and Wish Machine games
- Birthday guestbook/wish wall
- Music selector with original generated instrumentals: slow piano, a gentle Happy Birthday arrangement, and an upbeat party loop
- Responsive mobile/desktop layout and reduced-motion support

## Important notes about the party and guestbook

The party guests are animated characters built into the website, so they appear for every visitor without any server. The wish wall currently saves entries in that visitor's own browser (`localStorage`). It is **not** a shared live guestbook across different phones/computers.

To make real visitors' wishes appear for everyone, connect a hosted database such as Firebase Firestore or Supabase and add secure write rules. Do not put private service-account keys in this public repository. If you want, I can prepare the Firebase-connected version after you create a Firebase project and share its public web-app configuration (never share private keys).

## Music

The three included MP3s are original synthesized instrumental arrangements created for this site. They are not commercial recordings. The Happy Birthday track is a gentle instrumental arrangement of the traditional birthday melody. Visitors must press play; audio never autoplays.

To replace a track, use your own music or audio you have permission to publish, keeping the same filenames:

- `assets/music/slow-piano.mp3`
- `assets/music/happy-birthday.mp3`
- `assets/music/party-upbeat.mp3`

## Customising

- Edit the birthday text and captions in `index.html`.
- Edit the film scenes and wishes in `js/main.js`.
- Edit colours and layout in `css/style.css`.
- Replace photos in `assets/images/` and update the matching image paths in `index.html` and `js/main.js` if filenames change.

## Tech

Plain HTML, CSS, vanilla JavaScript and Three.js (loaded as an ES module from jsDelivr). No build step, API key, or paid hosting required. The 3D scene needs internet access to load Three.js; the rest of the website remains static.


## Full adventure-game quest system
The 3D island now has a four-part quest log:
1. Visit the Memory Cottage.
2. Win the timed Balloon Pop challenge in the Pixel Arcade (10 balloons in 20 seconds).
3. Speak with the birthday crew.
4. Collect all six wishing stars.
Complete all four objectives to unlock the secret-gate finale. The game runs in the browser with Three.js loaded from a CDN; an internet connection is required. This is a single-player browser game, not Roblox multiplayer. The guest characters are NPCs.
