import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Circle, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
  category?: string;
}

interface TaskTimelineProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskEdit: (taskId: string, newTitle: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskTimeline = ({ tasks, onTaskToggle, onTaskEdit, onTaskDelete }: TaskTimelineProps) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleTaskToggle = (taskId: string) => {
    onTaskToggle(taskId);
  };

  const handleEditStart = (task: Task) => {
    setEditingTask(task.id);
    setEditValue(task.title);
  };

  const handleEditSave = (taskId: string) => {
    if (editValue.trim()) {
      onTaskEdit(taskId, editValue.trim());
    }
    setEditingTask(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingTask(null);
    setEditValue("");
  };

  const groupTasksByDate = (tasks: Task[]) => {
    const grouped: { [date: string]: Task[] } = {};
    tasks.forEach(task => {
      const date = task.dueDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });
    return grouped;
  };

  const groupedTasks = groupTasksByDate(tasks);
  const dates = Object.keys(groupedTasks).sort();

  if (tasks.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No plan generated yet</h3>
          <p className="text-muted-foreground">Add your content above to create a personalized learning plan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress Header */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Your Progress
            </div>
            <div className="text-sm text-muted-foreground">
              {completedTasks} / {totalTasks} completed
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {progressPercentage.toFixed(0)}% complete
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {dates.map((date, dateIndex) => (
          <Card key={date} className="shadow-soft animate-slide-up" style={{ animationDelay: `${dateIndex * 100}ms` }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {groupedTasks[date].map((task, taskIndex) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-all duration-300",
                    task.completed 
                      ? "bg-success/5 border-success/20" 
                      : "bg-card border-border hover:border-primary/30"
                  )}
                  style={{ animationDelay: `${(dateIndex * 100) + (taskIndex * 50)}ms` }}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    className="mt-0.5"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {editingTask === task.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(task.id);
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleEditSave(task.id)}>Save</Button>
                          <Button size="sm" variant="outline" onClick={handleEditCancel}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className={cn(
                          "font-medium transition-all duration-300",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        {task.category && (
                          <span className="inline-block px-2 py-1 mt-2 text-xs bg-primary/10 text-primary rounded-full">
                            {task.category}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {editingTask !== task.id && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditStart(task)}
                        className="h-8 w-8"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onTaskDelete(task.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};