# The Lights on Radcliffe — Show Website

Static website for [www.lights-on-radcliffe.com](https://www.lights-on-radcliffe.com/), hosted on **GitHub Pages** with **Remote Falcon** embedded on `/request/`.

## Structure

- `index.html` — Main show page (88.3 FM, show hours, "Pick a Song" CTA, Second Harvest Food Bank donation link, 8 YouTube sequence videos, Google Maps directions)
- `request/index.html` — Dedicated full-height embedded Remote Falcon song picker (`https://lightsonradcliffe.remotefalcon.com/remote-falcon`)
- `how/index.html` — Hardware, software, and props breakdown
- `blog/index.html` — Seasonal build notes and updates
- `home/index.html` — Redirect from legacy Google Sites `/home` URL to `/`
- `assets/` — Shared stylesheet (`styles.css`), favicon (`favicon.svg`), and migrated show photos (`hero.jpg`, `blog-2023.jpg`)
- `remotefalcon/viewer-page.html` — Matching dark-theme Remote Falcon Viewer Page HTML template (paste into Remote Falcon Control Panel)
- `CNAME` — Custom domain configuration for GitHub Pages (`www.lights-on-radcliffe.com`)

---

## Deployment Checklist

### 1. Push to a Public GitHub Repository
Create a new **public** repo on GitHub (e.g., `lights-on-radcliffe`), then run:

```bash
git remote add origin https://github.com/<YOUR-USERNAME>/lights-on-radcliffe.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Open your repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then click **Save**.
4. Confirm **Custom domain** shows `www.lights-on-radcliffe.com` (read from `CNAME`).

### 3. Update DNS in Namecheap
In Namecheap → **Domain List → Manage → Advanced DNS** for `lights-on-radcliffe.com`:

1. Replace the existing `www` CNAME (`ghs.googlehosted.com`) with:
   - **Type:** `CNAME Record` | **Host:** `www` | **Value:** `<YOUR-USERNAME>.github.io.`
2. Add apex `A` records so `lights-on-radcliffe.com` (without `www`) redirects to `www.lights-on-radcliffe.com`:
   - `A` | `@` | `185.199.108.153`
   - `A` | `@` | `185.199.109.153`
   - `A` | `@` | `185.199.110.153`
   - `A` | `@` | `185.199.111.153`
3. Wait a few minutes for DNS propagation, then check **Enforce HTTPS** in GitHub Pages settings.

### 4. Apply the Matching Remote Falcon Template
1. Open the **Remote Falcon Control Panel → Viewer Page**.
2. Copy the entire contents of `remotefalcon/viewer-page.html` and paste it into the Viewer Page HTML editor.
3. Save — your `/request/` page will now blend seamlessly into the rest of the site with no duplicate header!

---

## Local Preview

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) (and [http://localhost:8080/request/](http://localhost:8080/request/) to test the live Remote Falcon embed).
