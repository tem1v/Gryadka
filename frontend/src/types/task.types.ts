export interface Task {
  id: string;
  plant: string;
  plot: string;
  actionTag: string;
  description: string;
  scheduledTime: string;
  scheduledDate: string;
  isCompleted: boolean;
  isOverdue: boolean;
}