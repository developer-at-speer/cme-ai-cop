"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { canAccessWorkbench } from "@/lib/rbac";
import { AI_MODELS } from "@/lib/types";
import type { AIModel } from "@/lib/types";
import { AppHeader } from "@/components/layout/AppHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WorkbenchPage() {
  const { user } = useAuth();
  const { runWorkbench, setWorkbenchDraft } = useAppData();
  const router = useRouter();

  const [modelKey, setModelKey] = useState<string>(AI_MODELS[0].name);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [tokenEstimate, setTokenEstimate] = useState<number | null>(null);
  const [costEstimate, setCostEstimate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  if (!canAccessWorkbench(user)) {
    return (
      <>
        <AppHeader title="AI Workbench" />
        <div className="p-6">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                You do not have access to the AI Workbench. Contact your CME
                administrator to request access.
              </p>
              <ButtonLink href="/dashboard" className="mt-4">
                Back to dashboard
              </ButtonLink>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const selectedModel = AI_MODELS.find((m) => m.name === modelKey) as AIModel;

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const result = await runWorkbench(user, selectedModel, prompt);
      setResponse(result.response_text);
      setTokenEstimate(result.token_estimate);
      setCostEstimate(result.cost_estimate);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    setWorkbenchDraft({
      title: prompt.slice(0, 60) + (prompt.length > 60 ? "..." : ""),
      problem_solved: "",
      manufacturing_use_case: "",
      category: "Quality Assurance",
      department: "Operations",
      workflow_steps: "1. Enter prompt in workbench\n2. Review response\n3. Refine and document",
      prompt_text: prompt,
      tools_used: "AI Workbench",
      models_used: selectedModel.label,
      expected_output: response.slice(0, 200),
      notes: "Created from AI Workbench session.",
      safety_considerations:
        "Do not upload or enter confidential, personal, customer, production, financial, or sensitive company data.",
      attribution_preference: "company",
    });
    router.push("/recipes/submit");
  };

  return (
    <>
      <AppHeader title="AI Workbench" />
      <div className="flex-1 p-4 md:p-6">
        <Alert className="mb-6 border-amber-300 bg-amber-50 text-amber-900">
          <AlertTitle className="text-amber-900">Sensitive data warning</AlertTitle>
          <AlertDescription>
            Do not upload or enter confidential, personal, customer, production,
            financial, or sensitive company data.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Prompt</CardTitle>
              <CardDescription>
                Test prompts and workflows with approved AI models.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={modelKey}
                  onValueChange={(v) => v && setModelKey(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((m) => (
                      <SelectItem key={m.name} value={m.name}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt">Your prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt or workflow instruction..."
                  rows={10}
                />
              </div>
              <Button onClick={handleRun} disabled={loading || !prompt.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  "Run prompt"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
              <CardDescription>
                {tokenEstimate !== null && (
                  <>
                    ~{tokenEstimate} tokens · est. ${costEstimate?.toFixed(4)}
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[240px] rounded-lg border bg-slate-50 p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-16 text-muted-foreground">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating response...
                  </div>
                ) : response ? (
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                    {response}
                  </pre>
                ) : (
                  <p className="py-16 text-center text-sm text-muted-foreground">
                    Run a prompt to see the response here.
                  </p>
                )}
              </div>
              {response && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy output"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    Save as draft recipe
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
