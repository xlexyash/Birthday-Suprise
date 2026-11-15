DUA — CINEMATIC BIRTHDAY WEBSITE
=================================

FILES
- index.html       Main five-scene birthday experience
- style.css        Responsive styling and animations
- script.js        Scene navigation and interactive effects
- assets/          Your four supplied photos and supplied music track

OPEN ON A LAPTOP
1. Extract birthday-website.zip.
2. Open the extracted birthday-website folder.
3. Double-click index.html. A current Chrome, Edge, Firefox or Safari browser is recommended.
4. For best results, keep the assets folder beside index.html. If your browser restricts local audio,
   run a tiny local server from this folder:
      python -m http.server 8000
   Then open http://localhost:8000

PHOTOS
The supplied mirror selfie is assets/dua-main.jpg and is the featured photograph.
The other supplied photos are dua-detail-1.jpg, dua-detail-2.jpg and dua-detail-3.jpg.
To replace a photo, keep the exact filename and overwrite that file in assets/.
The gallery uses the same four files in script.js for the lightbox, so keep the filenames unchanged.

MUSIC
Your uploaded audio file has been copied to assets/noizy.mp3.
The player starts only after the opening button is tapped, as required by browser autoplay rules.
Use the floating Music button to pause or resume. To replace the track, overwrite assets/noizy.mp3
with your preferred MP3 while keeping that filename.

PUBLISH ONLINE
Upload the complete extracted birthday-website folder (including assets/) to a static hosting service:
- Netlify: drag the folder into the Netlify Drop upload area.
- GitHub Pages: push the folder contents to a repository and enable Pages in repository settings.
- Cloudflare Pages: create a Pages project and deploy the folder.
After deployment, open the HTTPS URL on the phone and share that link with Dua.

NOTES
- The microphone is not requested. The candle wish interaction works with a tap.
- Balloon pop sounds and small chimes are generated locally with Web Audio; no external sound library is required.
- Google Fonts are loaded online. If offline, the page falls back to system serif/sans-serif fonts.
- This project has no build step and uses plain HTML, CSS and JavaScript.
