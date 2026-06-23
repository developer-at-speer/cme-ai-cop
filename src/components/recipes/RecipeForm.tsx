"use client";

import type { RecipeDraft } from "@/lib/types";
import {
  RECIPE_CATEGORIES,
  RECIPE_DEPARTMENTS,
  type AttributionPreference,
} from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RecipeFormProps {
  value: RecipeDraft;
  onChange: (value: RecipeDraft) => void;
}

export const emptyRecipeDraft = (): RecipeDraft => ({
  title: "",
  problem_solved: "",
  manufacturing_use_case: "",
  category: RECIPE_CATEGORIES[0],
  department: RECIPE_DEPARTMENTS[0],
  workflow_steps: "",
  prompt_text: "",
  tools_used: "AI Workbench",
  models_used: "",
  expected_output: "",
  notes: "",
  safety_considerations: "",
  attribution_preference: "company",
});

export function RecipeForm({ value, onChange }: RecipeFormProps) {
  const update = (field: keyof RecipeDraft, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem">Problem solved</Label>
        <Textarea
          id="problem"
          value={value.problem_solved}
          onChange={(e) => update("problem_solved", e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="usecase">Manufacturing use case</Label>
        <Textarea
          id="usecase"
          value={value.manufacturing_use_case}
          onChange={(e) => update("manufacturing_use_case", e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={value.category}
            onValueChange={(v) => v && update("category", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECIPE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            value={value.department}
            onValueChange={(v) => v && update("department", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECIPE_DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workflow">Prompt / workflow steps</Label>
        <Textarea
          id="workflow"
          value={value.workflow_steps}
          onChange={(e) => update("workflow_steps", e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt text</Label>
        <Textarea
          id="prompt"
          value={value.prompt_text}
          onChange={(e) => update("prompt_text", e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tools">Tools used</Label>
          <Input
            id="tools"
            value={value.tools_used}
            onChange={(e) => update("tools_used", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="models">Models used</Label>
          <Input
            id="models"
            value={value.models_used}
            onChange={(e) => update("models_used", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expected">Expected output</Label>
        <Textarea
          id="expected"
          value={value.expected_output}
          onChange={(e) => update("expected_output", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes / limitations</Label>
        <Textarea
          id="notes"
          value={value.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="safety">Safety considerations</Label>
        <Textarea
          id="safety"
          value={value.safety_considerations}
          onChange={(e) => update("safety_considerations", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <Label>Attribution preference</Label>
        <RadioGroup
          value={value.attribution_preference}
          onValueChange={(v) =>
            v && update("attribution_preference", v as AttributionPreference)
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="company" id="attr-company" />
            <Label htmlFor="attr-company" className="font-normal">
              Show company name
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="author" id="attr-author" />
            <Label htmlFor="attr-author" className="font-normal">
              Show author name
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="anonymous" id="attr-anon" />
            <Label htmlFor="attr-anon" className="font-normal">
              Anonymous
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
