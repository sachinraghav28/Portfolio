# Sachin Raghav Portfolio

This is a static single-page personal portfolio built with HTML, CSS and a bit of JavaScript. It is contained entirely in the `portfolio_site` folder and can be deployed to any static hosting service.

## Contents

- `index.html` – main page
- `style.css` – styling
- `script.js` – optional JS for smooth scrolling & form handling

## Deployment Options

You can deploy this site using any of the following methods:

### GitHub Pages
1. Initialize a git repository if you haven't already:
   ```powershell
   cd d:\Portfolio\sachin_raghav\portfolio_site
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   # add your GitHub repo as remote
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
2. In your GitHub repository settings, enable **Pages** and set the source to the `main` branch (or `gh-pages` branch if you prefer).
3. After a few minutes, your site will be live at `https://<username>.github.io/<repo>/`.

_Note:_ you can also install the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package and add a deploy script:

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:

```json
"scripts": {
  "deploy": "gh-pages -d ."
}
```

Run `npm run deploy` to publish to the `gh-pages` branch automatically.

### Netlify / Vercel / Surge

- Drag and drop the `portfolio_site` folder into the dashboard of Netlify or Surge.
- For Vercel, run `vercel` from the folder after installing the CLI (`npm i -g vercel`).

These services will automatically host the static files and provide a custom domain.

### Manual Hosting

Copy the contents of the folder to any web server (Apache, Nginx, etc.) or deploy via FTP.

## Notes

- No build step required.
- Ensure all files remain at the root of the deployment (no subdirectories needed).
- To update the site, simply replace the files and redeploy.

Feel free to add more customization or a backend later!