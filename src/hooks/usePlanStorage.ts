import { useState, useEffect } from "react";
import { Task } from "@/components/TaskTimeline";

interface PlanData {
  tasks: Task[];
  content: string;
  timeframe: string;
  createdAt: string;
}

export const usePlanStorage = () => {
  const [planData, setPlanData] = useState<PlanData | null>(null);

  // Load plan from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem("ai-task-planner");
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        setPlanData(parsed);
      } catch (error) {
        console.error("Error loading saved plan:", error);
        localStorage.removeItem("ai-task-planner");
      }
    }
  }, []);

  // Save plan to localStorage whenever it changes
  const savePlan = (data: PlanData) => {
    setPlanData(data);
    localStorage.setItem("ai-task-planner", JSON.stringify(data));
  };

  // Update tasks
  const updateTasks = (tasks: Task[]) => {
    if (planData) {
      const updatedPlan = { ...planData, tasks };
      savePlan(updatedPlan);
    }
  };

  // Clear plan
  const clearPlan = () => {
    setPlanData(null);
    localStorage.removeItem("ai-task-planner");
  };

  return {
    planData,
    savePlan,
    updateTasks,
    clearPlan,
  };
};