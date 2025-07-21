# MultiFaceDetection

An Angular application that:

* **Opens your webcam**
* **Detects faces in real time** with [face-api.js](https://github.com/justadudewhohacks/face-api.js)
* **Matches each live face** against a set of labeled images (in `src/assets/labeled_images/`) by computing face descriptors and comparing Euclidean distance
* **Overlays bounding boxes and names** on the video feed

## Prerequisites

* **Node.js** (v16 or later)
* **npm** (v8 or later)
* **Angular CLI** v19.2.15+
  Install globally if you haven’t already:

  ```bash
  npm install -g @angular/cli@19
  ```

## Project Structure

```
multiFaceDetection/           # project root
├── scripts/
│   └── generate-manifest.js # generates manifest.json from image files
├── src/
│   ├── assets/
│   │   ├── labeled_images/  # drop your face images here
│   │   │   ├── Alice.jpg
│   │   │   ├── Bob.jpeg
│   │   │   └── manifest.json (auto-generated)
│   │   ├── models/          # face-api.js model weights
│   │   └── mask.png         # overlay mask (optional)
│   ├── app/                 # Angular components & services
│   ├── index.html
│   └── main.ts
├── angular.json             # Angular CLI config
├── package.json             # npm configuration & scripts
└── README.md                # this file
```

## Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd multiFaceDetection
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add your labeled images**

   * Place **exactly one** photo per person inside `src/assets/labeled_images/`.
   * Name each file **exactly** as the person’s label, with extension `.jpg` or `.jpeg` (e.g. `Alice.jpg`, `Bob.jpeg`).

4. **Generate `manifest.json`**
   This file tells the app which labels to load. Run:

   ```bash
   npm run faces:manifest
   ```

   or directly:

   ```bash
   node scripts/generate-manifest.js
   ```

   You should see:

   ```text
   ✅ Generated manifest.json at src/assets/labeled_images/manifest.json with X labels.
   ```

5. **Verify assets**
   Confirm your folder now contains:

   ```text
   src/assets/labeled_images/
     ├─ Alice.jpg
     ├─ Bob.jpeg
     └─ manifest.json
   ```

## Development Server

To start the app locally with live reloading:

```bash
ng serve
```

Open your browser at [http://localhost:4200](http://localhost:4200).
**Allow camera access** when prompted.

## Usage

* The app will load your labeled images’ descriptors on startup.
* It then captures your webcam feed, detects faces, computes their descriptors, and finds the **closest match** among your labeled images.
* Each detected face is boxed in red, with the matched name (and distance) displayed above.

## Building for Production

```bash
npm run build
```

This runs the manifest script first, then builds the optimized production bundle into `dist/`.

## Testing

* **Unit tests**:  `ng test`
* **End-to-end tests**:  `ng e2e`

## Troubleshooting

* **Camera not opening**: Ensure your browser has camera permissions and you’re using `https://` or `localhost`.
* **Faces not recognized**:

  * Verify your sample images are clear headshots in similar lighting/angle to your webcam.
  * Check `manifest.json` lists the correct labels.
  * Adjust matching threshold in `web-cam.component.ts` (`FaceMatcher` constructor).

## References

* face-api.js README: [https://github.com/justadudewhohacks/face-api.js](https://github.com/justadudewhohacks/face-api.js)
* Angular CLI Documentation: [https://angular.io/cli](https://angular.io/cli)
