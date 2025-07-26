import { Task } from "@/components/TaskTimeline";

// Mock AI service - replace with actual Gemini API integration
export const generatePlanWithAI = async (content: string, timeframe: string): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Parse timeframe to get number of days
  const timeframeDays = {
    "1-week": 7,
    "2-weeks": 14,
    "1-month": 30,
    "3-months": 90,
    "6-months": 180,
    "1-year": 365,
  }[timeframe] || 30;

  // Extract topics and create tasks (this would be replaced with actual AI processing)
  const topics = extractTopicsFromContent(content);
  const tasks = createTasksFromTopics(topics, timeframeDays);

  return tasks;
};

const extractTopicsFromContent = (content: string): string[] => {
  // Simple content analysis - replace with AI processing
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const topics: string[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    // Look for chapter/module/topic indicators
    if (trimmed.match(/^(chapter|module|unit|lesson|week|day|\d+\.)/i)) {
      topics.push(trimmed);
    } else if (trimmed.length > 10 && trimmed.length < 100) {
      topics.push(trimmed);
    }
  });

  // If no clear structure found, split into sentences
  if (topics.length === 0) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    topics.push(...sentences.slice(0, 10).map(s => s.trim()));
  }

  return topics.slice(0, 15); // Limit to reasonable number
};

const createTasksFromTopics = (topics: string[], totalDays: number): Task[] => {
  const tasks: Task[] = [];
  const startDate = new Date();
  
  // Distribute topics across the timeframe
  const daysPerTopic = Math.max(1, Math.floor(totalDays / topics.length));
  
  topics.forEach((topic, index) => {
    const taskDate = new Date(startDate);
    taskDate.setDate(startDate.getDate() + (index * daysPerTopic));
    
    // Create main study task
    tasks.push({
      id: `task-${index}-main`,
      title: `Study: ${topic}`,
      description: `Complete learning activities for this topic`,
      completed: false,
      dueDate: taskDate.toISOString().split('T')[0],
      category: "Study"
    });

    // Add practice task a day later for longer timeframes
    if (daysPerTopic > 1) {
      const practiceDate = new Date(taskDate);
      practiceDate.setDate(taskDate.getDate() + 1);
      
      tasks.push({
        id: `task-${index}-practice`,
        title: `Practice: ${topic}`,
        description: `Apply knowledge through exercises or examples`,
        completed: false,
        dueDate: practiceDate.toISOString().split('T')[0],
        category: "Practice"
      });
    }
  });

  // Add review milestones
  const reviewPoints = [0.25, 0.5, 0.75, 1.0];
  reviewPoints.forEach((point, index) => {
    const reviewDate = new Date(startDate);
    reviewDate.setDate(startDate.getDate() + Math.floor(totalDays * point));
    
    tasks.push({
      id: `review-${index}`,
      title: `Review Milestone ${index + 1}`,
      description: `Review and consolidate learning progress`,
      completed: false,
      dueDate: reviewDate.toISOString().split('T')[0],
      category: "Review"
    });
  });

  return tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
};

// For future Gemini API integration
export const callGeminiAPI = async (prompt: string): Promise<string> => {
  // This would be the actual API call to Gemini
  // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${API_KEY}`
  //   },
  //   body: JSON.stringify({
  //     contents: [{
  //       parts: [{ text: prompt }]
  //     }]
  //   })
  // });
  
  throw new Error("Gemini API integration not implemented yet");
};