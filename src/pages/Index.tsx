import { useState } from "react";
import { PlanInput } from "@/components/PlanInput";
import { TaskTimeline, Task } from "@/components/TaskTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, RefreshCw, Trash2 } from "lucide-react";
import { generatePlanWithAI } from "@/lib/ai";
import { usePlanStorage } from "@/hooks/usePlanStorage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { planData, savePlan, updateTasks, clearPlan } = usePlanStorage();
  const { toast } = useToast();

  const handleGeneratePlan = async (content: string, timeframe: string) => {
    setIsGenerating(true);
    try {
      const tasks = await generatePlanWithAI(content, timeframe);
      const newPlan = {
        tasks,
        content,
        timeframe,
        createdAt: new Date().toISOString(),
      };
      savePlan(newPlan);
      
      toast({
        title: "Plan Generated Successfully!",
        description: `Created ${tasks.length} tasks for your learning journey.`,
      });
    } catch (error) {
      console.error("Error generating plan:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskToggle = (taskId: string) => {
    if (!planData) return;
    
    const updatedTasks = planData.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    updateTasks(updatedTasks);

    const task = planData.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "Task Completed!",
        description: `Great job completing: ${task.title}`,
      });
    }
  };

  const handleTaskEdit = (taskId: string, newTitle: string) => {
    if (!planData) return;
    
    const updatedTasks = planData.tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    );
    updateTasks(updatedTasks);
  };

  const handleTaskDelete = (taskId: string) => {
    if (!planData) return;
    
    const updatedTasks = planData.tasks.filter(task => task.id !== taskId);
    updateTasks(updatedTasks);
    
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your plan.",
    });
  };

  const handleClearPlan = () => {
    clearPlan();
    toast({
      title: "Plan Cleared",
      description: "Your plan has been reset. You can create a new one above.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Task Buddy</h1>
                <p className="text-sm text-muted-foreground">Transform any content into a structured learning plan</p>
              </div>
            </div>
            
            {planData && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGeneratePlan(planData.content, planData.timeframe)}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPlan}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Plan
                </Button>
              </div>
              
            )}
          </div>
        </div>  
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <PlanInput 
            onGeneratePlan={handleGeneratePlan}
            isGenerating={isGenerating}
          />

          {/* Plan Summary */}
          {planData && (
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Plan Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{planData.tasks.length}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {planData.tasks.filter(t => t.completed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">
                      {planData.timeframe.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Section */}
          <TaskTimeline
            tasks={planData?.tasks || []}
            onTaskToggle={handleTaskToggle}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      </main>
       <footer className="border-t text-center text-sm text-muted-foreground py-4">
       © 2025 Syed. All rights reserved.

      </footer>
    </div>
    
  );
};

export default Index;
