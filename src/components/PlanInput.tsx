import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Upload, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlanInputProps {
  onGeneratePlan: (content: string, timeframe: string) => void;
  isGenerating: boolean;
}

export const PlanInput = ({ onGeneratePlan, isGenerating }: PlanInputProps) => {
  const [content, setContent] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content to generate a plan.",
        variant: "destructive",
      });
      return;
    }

    if (!timeframe) {
      toast({
        title: "Timeframe Required",
        description: "Please select a timeframe for your plan.",
        variant: "destructive",
      });
      return;
    }

    onGeneratePlan(content, timeframe);
  };

  const timeframeOptions = [
    { value: "1-week", label: "1 Week" },
    { value: "2-weeks", label: "2 Weeks" },
    { value: "1-month", label: "1 Month" },
    { value: "3-months", label: "3 Months" },
    { value: "6-months", label: "6 Months" },
    { value: "1-year", label: "1 Year" },
  ];

  return (
    <Card className="bg-gradient-card shadow-medium animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-accent" />
          Create Your Learning Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Learning Content or Syllabus
          </label>
          <Textarea
            placeholder="Paste your syllabus, course content, project outline, or any learning material here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-muted focus:border-primary transition-colors"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Upload className="h-3 w-3" />
            PDF upload coming soon
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Planning Timeframe
          </label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="border-muted focus:border-primary">
              <SelectValue placeholder="Choose your timeframe">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{timeframeOptions.find(opt => opt.value === timeframe)?.label || "Choose your timeframe"}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={isGenerating}
          variant="ai"
          size="lg"
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate AI Plan
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};