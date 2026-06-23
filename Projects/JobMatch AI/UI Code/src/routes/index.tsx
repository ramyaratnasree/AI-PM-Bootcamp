import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  X,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { analyzeMatch, type AnalysisResult } from "@/lib/analyze.functions";
import { extractResumeText } from "@/lib/resume-parser";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JobMatch AI — Should you apply for this job?" },
      {
        name: "description",
        content:
          "Upload your resume and paste a job description. JobMatch AI tells you instantly if you should apply, what matches, and how to improve your resume.",
      },
      { property: "og:title", content: "JobMatch AI — Should you apply for this job?" },
      {
        property: "og:description",
        content:
          "AI-powered resume to job description match analysis with skills, scoring, and tailored improvement suggestions.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const analyze = useServerFn(analyzeMatch);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jd, setJd] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    const lower = f.name.toLowerCase();
    if (!lower.endsWith(".pdf") && !lower.endsWith(".docx")) {
      toast.error("Please upload a PDF or DOCX file.");
      return;
    }
    setFile(f);
    setParsing(true);
    try {
      const text = await extractResumeText(f);
      if (text.length < 30) {
        toast.error("Couldn't read enough text from this file. Try a different resume.");
        setFile(null);
        setResumeText("");
      } else {
        setResumeText(text);
        toast.success("Resume uploaded");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to read file");
      setFile(null);
    } finally {
      setParsing(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onAnalyze = async () => {
    if (!resumeText) {
      toast.error("Upload your resume first.");
      return;
    }
    if (jd.trim().length < 30) {
      toast.error("Paste the full job description.");
      return;
    }
    setAnalyzing(true);
    setResult(null);
    try {
      const r = await analyze({ data: { resumeText, jobDescription: jd } });
      setResult(r);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <header className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered resume analysis
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Should you apply for this job?
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-balance text-sm text-muted-foreground">
            Upload your resume, paste a job description, and get an instant verdict with the skills
            you match, what's missing, and how to improve.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          {/* Left: upload */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
                <Upload className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Your resume</h2>
            </div>

            {!file ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cn(
                  "flex h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed text-center transition-colors",
                  dragOver
                    ? "border-primary bg-accent"
                    : "border-border bg-surface hover:border-primary/50 hover:bg-accent/40",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-sm">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Drop your resume here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">PDF or DOCX, up to 10 MB</p>
                </div>
              </button>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  {parsing ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="max-w-full">
                  <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {parsing
                      ? "Reading file…"
                      : `${(file.size / 1024).toFixed(0)} KB · ${resumeText.length.toLocaleString()} chars extracted`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setResumeText("");
                  }}
                  disabled={parsing}
                >
                  <X className="mr-1 h-3.5 w-3.5" /> Remove
                </Button>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>

          {/* Right: JD */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Job description</h2>
            </div>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here..."
              className="h-48 resize-none border-border bg-surface text-sm leading-relaxed focus-visible:ring-primary/30"
            />
          </div>
        </section>

        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={onAnalyze}
            disabled={analyzing || parsing}
            className="h-12 rounded-xl bg-[image:var(--gradient-primary)] px-8 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform hover:scale-[1.02] disabled:opacity-70"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing your match…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Match
              </>
            )}
          </Button>
        </div>

        {result && (
          <section id="results" className="mt-14 space-y-6">
            <RecommendationHero result={result} />
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              <MatchScoreCard score={result.matchScore} />
              <SummaryCard summary={result.summary} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">             
                <SkillsCard
                title="Matching skills"
                description="Found in both your resume and the job description"
                skills={result.matchingSkills}
                variant="success"
        
           />
            <SkillsCard
              title="Missing skills"
              description="Mentioned in the job description but missing from your resume"
              skills={result.missingSkills}
              variant="warning"
            />
             </div>
            <ImprovementCard suggestions={result.improvementSuggestions} />
          
          </section>
        )}

        <footer className="mt-20 text-center text-xs text-muted-foreground">
          Built with Lovable AI.
        </footer>
      </div>
    </div>
  );
}

function RecommendationHero({ result }: { result: AnalysisResult }) {
  const map = {
    recommended: {
      icon: CheckCircle2,
      label: "Recommended to Apply",
      emoji: "🟢",
      tone: "bg-success/10 text-success ring-success/20",
      bar: "bg-success",
    },
    apply_if_interested: {
      icon: AlertTriangle,
      label: "Apply if Interested",
      emoji: "🟡",
      tone: "bg-warning/15 text-warning-foreground ring-warning/30",
      bar: "bg-warning",
    },
    not_recommended: {
      icon: XCircle,
      label: "Not Recommended",
      emoji: "🔴",
      tone: "bg-destructive/10 text-destructive ring-destructive/20",
      bar: "bg-destructive",
    },
  } as const;
  const cfg = map[result.recommendation];
  const Icon = cfg.icon;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elevated)]">
      <div className={cn("h-1.5 w-full", cfg.bar)} />
      <div className="p-8">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl ring-1",
                cfg.tone,
              )}
            >
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recommendation
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {cfg.emoji} {cfg.label}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-2 text-sm">
            <span className="text-muted-foreground">Confidence: </span>
            <span className="font-semibold text-foreground">{result.confidence}</span>
          </div>
        </div>
        <p className="mt-6 text-base leading-relaxed text-foreground/80">
          {result.recommendationExplanation}
        </p>
      </div>
    </div>
  );
}

function MatchScoreCard({ score }: { score: number }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
      <div className="relative h-44 w-44">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="var(--color-muted)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#scoreGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary-glow)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-tight text-foreground">{score}%</span>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Match
          </span>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Based on skills, experience, education, and keywords found in your resume.
      </p>
    </div>
  );
}

function SkillsCard({
  title,
  description,
  skills,
  variant,
}: {
  title: string;
  description: string;
  skills: string[];
  variant: "success" | "warning";
}) {
  const styles =
    variant === "success"
      ? "bg-success/10 text-success ring-1 ring-inset ring-success/20 hover:bg-success/15"
      : "bg-warning/15 text-warning-foreground ring-1 ring-inset ring-warning/30 hover:bg-warning/20";
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {skills.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">None identified.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className={cn(
                "rounded-full border-0 px-3 py-1 text-xs font-medium transition-colors",
                styles,
              )}
            >
              {s}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function ImprovementCard({ suggestions }: { suggestions: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
          <Wand2 className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Resume improvement suggestions</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="flex gap-3 rounded-xl bg-surface p-3 text-sm text-foreground/85">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              {i + 1}
            </span>
            <span className="leading-relaxed">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummaryCard({ summary }: { summary: string }) {
  return (
    <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold text-foreground">AI summary</h3>
      </div>
      <p className="mt-4 text-base leading-relaxed text-foreground/85">{summary}</p>
    </div>
  );
}
