import { create } from "zustand"

import { api } from "@/api/axios"

import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto
} from "@/types/task.types"

interface TasksState {

  tasks: Task[]

  isLoading: boolean

  getTasks: () => Promise<void>

  createTask: (
    data: CreateTaskDto
  ) => Promise<void>

  updateTask: (
    data: UpdateTaskDto
  ) => Promise<void>

  deleteTask: (
    id: string
  ) => Promise<void>
}

export const useTasksStore =
  create<TasksState>((set, get) => ({

    tasks: [],

    isLoading: false,


    getTasks: async () => {

      try {

        set({ isLoading: true })

        const response =
          await api.get("/tasks")

        set({
          tasks: response.data
        })

      } catch (error) {

        console.error(error)

      } finally {

        set({ isLoading: false })

      }
    },


    createTask: async (data) => {

      try {

        const response =
          await api.post(
            "/tasks",
            data
          )

        set({
          tasks: [
            ...get().tasks,
            response.data
          ]
        })

      } catch (error) {

        console.error(error)

      }
    },


    updateTask: async (data) => {

      try {

        const response =
          await api.put(
            `/tasks/${data.id}`,
            {
              garden_plot_id:
              data.garden_plot_id,

              plant_name:
              data.plant_name,

              plant_grade:
              data.plant_grade,

              location:
              data.location,

              task_tag:
              data.task_tag,

              task_date:
              data.task_date,

              task_time:
              data.task_time,

              send_email_notification:
              data.send_email_notification,

              is_completed:
              data.is_completed
            }
          )

        set({
          tasks: get().tasks.map(
            (task) =>
              task.id === data.id
                ? response.data
                : task
          )
        })

      } catch (error) {

        console.error(error)

      }
    },


    deleteTask: async (id) => {

      try {

        await api.delete(
          `/tasks/${id}`
        )

        set({
          tasks: get().tasks.filter(
            (task) =>
              task.id !== id
          )
        })

      } catch (error) {

        console.error(error)

      }
    }

  }))