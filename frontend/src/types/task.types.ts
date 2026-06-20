export type TaskTag =
  | "planting"
  | "watering"
  | "fertilizing"
  | "processing"
  | "harvesting"
  | "cleaning"

export interface Task {
  id: string;
  user_id: string;
  plant_name: string
  plant_grade: string
  garden_plot_id: string;
  task_tag: string;
  location: string;
  description: string;
  task_time: string;
  task_date: string;
  is_completed: boolean;
  is_overdue: boolean;
  created_at: string
  send_email_notification: boolean
}

export interface CreateTaskDto {
  garden_plot_id: string
  plant_name: string
  plant_grade: string
  location: string
  task_tag: TaskTag
  task_date: string
  task_time: string
  send_email_notification: boolean
}

export interface UpdateTaskDto
  extends CreateTaskDto {
  id: string
  is_completed?: boolean
}