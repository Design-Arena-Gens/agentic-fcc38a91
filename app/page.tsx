'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { analyzeBitmap } from "../lib/analyzer";
import type { AnalysisResult } from "../lib/types";
import { MetricBar } from "../components/metric-bar";

type FileState = {
  file: File;
  objectUrl: string;
};

export default function Page() {
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if (fileState?.objectUrl) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file in JPEG, PNG, or WebP format.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Please select an image under 10 MB.");
      return;
    }
    setError(null);
    setResult(null);
    if (fileState?.objectUrl) {
      URL.revokeObjectURL(fileState.objectUrl);
    }
    setFileState({
      file,
      objectUrl: URL.createObjectURL(file)
    });
  }, [fileState]);

  const reset = useCallback(() => {
    if (fileState?.objectUrl) {
      URL.revokeObjectURL(fileState.objectUrl);
    }
    setFileState(null);
    setError(null);
    setResult(null);
    setIsAnalyzing(false);
  }, [fileState]);

  const runAnalysis = useCallback(async () => {
    if (!fileState) {
      setError("Upload an image to begin analysis.");
      return;
    }
    try {
      setIsAnalyzing(true);
      setError(null);
      const bitmap = await createImageBitmap(fileState.file);
      const analysis = await analyzeBitmap(bitmap);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Unable to analyze the image. Please try a different file.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [fileState]);

  const probabilityInsight = useMemo(() => {
    if (!result) return null;
    const { classification } = result;
    const opposingLabel = classification.label === "CT Scan" ? "MRI" : "CT Scan";
    const opposingProbability =
      classification.label === "CT Scan"
        ? classification.probabilityMRI
        : classification.probabilityCT;
    return `AI estimates ${classification.label} at ${(classification.confidence * 100).toFixed(
      1
    )}% confidence versus ${(opposingProbability * 100).toFixed(1)}% for ${opposingLabel}.`;
  }, [result]);

  return (
    <main className="flex flex-1 flex-col gap-10 pb-10 pt-6">
      <header className="flex flex-col gap-4">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-teal/40 bg-brand-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
          Radiology Modality Intelligence
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
          CT vs MRI Modality Analyst
        </h1>
        <p className="max-w-3xl text-base text-slate-300 md:text-lg">
          Upload a CT or MRI output image and let the embedded machine learning pipeline extract
          radiomics-inspired features, estimate modality likelihood, and highlight interpretive cues.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-1 flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center">
            <p className="text-sm text-slate-300">
              Drag & drop or click to upload a DICOM export (saved as PNG/JPEG/WebP). Images stay on
              device—analysis runs fully in-browser.
            </p>
            <label
              className="mx-auto inline-flex cursor-pointer items-center gap-3 rounded-full bg-brand-teal px-5 py-2 text-sm font-semibold uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400"
              htmlFor="image-upload"
            >
              <input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <span>{fileState ? "Replace Image" : "Upload Imaging Slice"}</span>
            </label>
            {fileState && (
              <button
                onClick={reset}
                className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-300"
              >
                Clear selection
              </button>
            )}
          </div>
          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            {fileState ? (
              <div className="flex flex-col gap-3">
                <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                  <Image
                    src={fileState.objectUrl}
                    alt="Uploaded medical imaging"
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="(min-width: 1024px) 540px, 90vw"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{fileState.file.name}</span>
                  <span>{(fileState.file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            ) : (
              <div className="flex h-60 items-center justify-center text-sm text-slate-500">
                Imaging preview will appear here after upload.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-white">AI Modality Classification</h2>
            <p className="text-sm text-slate-400">
              Feature extraction is driven by TensorFlow.js using intensity moments, Sobel edge
              topology, and center-weighted signal analysis.
            </p>
          </div>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing || !fileState}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-brand-teal to-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <span className="h-2 w-2 animate-ping rounded-full bg-slate-950" />
                Running analysis…
              </>
            ) : (
              <>Analyze Imaging</>
            )}
          </button>

          {result && (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-brand-teal/40 bg-brand-teal/10 p-5">
                <div className="text-sm uppercase tracking-wider text-brand-teal/90">Prediction</div>
                <div className="mt-1 text-3xl font-semibold text-white">
                  {result.classification.label}
                </div>
                <p className="mt-3 text-sm text-slate-300">{probabilityInsight}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {result.featureHighlights.map((highlight) => (
                  <MetricBar
                    key={highlight.name}
                    label={highlight.name}
                    value={highlight.value}
                    min={highlight.range[0]}
                    max={highlight.range[1]}
                    annotation={highlight.interpretation}
                  />
                ))}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <h3 className="text-lg font-semibold text-white">Interpretability Insights</h3>
                <div className="mt-4 space-y-4">
                  {result.insights.map((insight) => (
                    <div key={insight.title}>
                      <div className="text-sm font-semibold text-brand-teal">{insight.title}</div>
                      <p className="text-sm text-slate-300">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!result && !isAnalyzing && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-sm text-slate-500">
              Upload an imaging slice and run analysis to surface modality likelihoods, feature
              gradients, and AI-assisted commentary.
            </div>
          )}

          {isAnalyzing && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-sm text-slate-400">
              Tensor engines are extracting features (intensity moments, edge topology, center
              focus). This usually takes a few seconds.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-inner shadow-slate-950/60">
        <h2 className="text-lg font-semibold text-white">Pipeline Overview</h2>
        <p className="mt-3 text-sm text-slate-400">
          The analyzer performs a lightweight radiomics pass—converting the image to tensor form,
          computing intensity distributions, Sobel gradient densities, channel variance, and
          center-weighted focus. These features feed a calibrated logistic model tuned to separate
          CT (high-contrast, bone-centric) from MRI (soft-tissue, balanced gradients). No data leaves
          your browser.
        </p>
      </section>
    </main>
  );
}
