# CT vs MRI Modality Analyzer

Next.js web application that differentiates CT scans from MRI outputs using an in-browser TensorFlow.js pipeline. Users can upload medical imaging exports (PNG/JPEG/WebP) and receive AI-backed modality probabilities, feature breakdowns, and interpretability insights.

## ⚙️ Stack

- Next.js 14 (App Router) with React 18
- Tailwind CSS for theming
- TensorFlow.js for feature extraction and lightweight inference

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and upload an imaging slice to see the analyzer in action.

## 🧠 How It Works

1. The image stays on-device and is converted into a tensor inside the browser.
2. Radiomics-inspired features are extracted (intensity statistics, Sobel edge density, channel variance, center-weighted focus).
3. A calibrated logistic model estimates the probability that the slice originated from a CT scan versus an MRI acquisition.
4. Results surface interpretability insights and normalized feature metrics to support decision making.

## 📦 Scripts

- `npm run dev` – Start development server
- `npm run build` – Create production bundle
- `npm start` – Serve production build
- `npm run lint` – Run ESLint checks

## 📄 License

MIT
