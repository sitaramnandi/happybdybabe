# Happy Birthday Website ❤️

A romantic 3D birthday website for April 19.

## Folder Structure
```
bdy/
├── index.html          ← Main page
├── style.css           ← All styles
├── script.js           ← All JavaScript
└── assets/
    ├── images/         ← Put your photos here
    │   └── README.txt  ← Photo instructions
    └── music/          ← Put your background.mp3 here
        └── README.txt  ← Music instructions
```

## Customization Checklist

### 1. Add Photos
- Drop your photos into `assets/images/`
- Open `script.js` and edit the `photoData` array at the very top

### 2. Add Music
- Drop a romantic MP3 into `assets/music/` named `background.mp3`

### 3. Edit the Love Story Timeline
- Open `index.html` and find the `<!-- TIMELINE -->` section
- Change the dates, titles, and text for each chapter

### 4. Edit the Love Letter
- Open `index.html` and find the `<!-- LOVE LETTER -->` section
- Replace the text with your personal message

### 5. Change Her Name / Your Name
- Search `index.html` for "Your Love ❤️" and replace with your name

---

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push all files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Birthday website"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to **Settings → Pages → Source → Deploy from branch → main / root**
4. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Deploy to Render (Static Site)

1. Push to GitHub (steps above)
2. Go to [render.com](https://render.com) → New → Static Site
3. Connect your GitHub repo
4. Set **Publish directory** to `.` (dot)
5. Click **Create Static Site**

---

Built with HTML · CSS · JavaScript · Three.js · canvas-confetti
