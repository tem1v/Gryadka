import {Button} from "@/components/ui/Button.tsx";
import {LucideCheck, LucidePlus, LucideSquarePen, LucideTrash2} from "lucide-react";
import type {Task} from "@/types/task.types.ts";
import {Checkbox, Table, type Selection, Chip, AlertDialog, TextField, Input, Label, ComboBox, ListBox, Form} from "@heroui/react";
import {useEffect, useState} from "react";
import {cn} from "@heroui/styles";
import {TASK_VARIANTS} from "@/constants/taskVariants.ts";
import {ActionButtons} from "@/components/ui/ActionButtons.tsx";
import {useTasksStore} from "@/store/tasks.store.ts";
import {formatDate} from "@/utils/formatDate.ts";
import {useAuthStore} from "@/store/auth.store.ts";
import {usePlotsStore} from "@/store/plots.store.ts";
import {usePlantsStore} from "@/store/plants.store.ts";

interface Props {

};

const groupTasksByDate = (tasks:Task[]) => {
  return tasks.reduce((acc, task) => {
    const date = task.task_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};

export function TasksPage(props: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [selectedPlotId, setSelectedPlotId] = useState("")
  const [selectedPlantId, setSelectedPlantId] = useState("")
  const [taskTag, setTaskTag] = useState("")
  const [taskDate, setTaskDate] = useState("")
  const [taskTime, setTaskTime] = useState("")
  const [editTaskId, setEditTaskId] = useState("")

  const [taskPlantName, setTaskPlantName] = useState("")

  const [taskPlantGrade, setTaskPlantGrade] = useState("")

  const [sendEmailNotification, setSendEmailNotification] = useState(false)
  const selectedLocation = useAuthStore((state) => state.selectedLocation)
  const getPlots = usePlotsStore(
    (state) => state.getPlots
  )

  const plots = usePlotsStore(
    (state) => state.plots
  )
  const tasks = useTasksStore((state) => state.tasks)
    .filter((t) => !t.is_completed)
    .sort((a, b) => {

      const dateA = new Date(
        `${a.task_date}T${a.task_time}`
      ).getTime()

      const dateB = new Date(
        `${b.task_date}T${b.task_time}`
      ).getTime()

      return dateA - dateB
    })
  const plants = usePlantsStore(
    (state) => state.plants
  )

  const getPlantsByPlotId = usePlantsStore((state)=>state.getPlantsByPlot)

  const getTasks = useTasksStore(
    (state) => state.getTasks
  )
  const createTask = useTasksStore((state) => state.createTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);
  const updateTask = useTasksStore((state) => state.updateTask);

  useEffect(() => {
    getPlots()
    getTasks()

  }, [])

  const handleCreateTask = async () => {

    const selectedPlant =
      plants.find(
        (plant) =>
          plant.id === selectedPlantId
      )

    if (!selectedPlant) return

    await createTask({

      garden_plot_id:
      selectedPlotId,

      plant_name:
      selectedPlant.name,

      plant_grade:
      selectedPlant.grade,

      location:
        selectedLocation ?? "",

      task_tag:
      taskTag,

      task_date:
      taskDate,

      task_time:
        `${taskTime}:00.000Z`,

      send_email_notification:
        false
    })
    clearForm()
  }
  const initTaskEdit = async (task) => {
    setEditTaskId(task.id)
    setSelectedPlotId(task.garden_plot_id)
    setTaskTag(task.task_tag)
    setTaskDate(task.task_date)
    setTaskTime(task.task_time.slice(0, 5))
    setSendEmailNotification(task.send_email_notification)

    setTaskPlantName(task.plant_name)
    setTaskPlantGrade(task.plant_grade)

    await getPlantsByPlotId(task.garden_plot_id)

    const currentPlants = usePlantsStore.getState().plants
    const plant = currentPlants.find(
      p => p.name === task.plant_name && p.grade === task.plant_grade
    )
    setSelectedPlantId(plant?.id ?? "")
  }

  const clearForm = async () => {
    setSelectedPlantId("")
    setTaskDate('')
    setTaskTime('')
    setTaskTag('');
  }
  const formatTaskTime = (
    time: string
  ) => {

    return `${time}:00.000Z`
  }
  return (
    <div className='mx-auto mt-25 max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>Задачи</h1>
        <AlertDialog>
          <AlertDialog.Trigger>
            <Button>
              <LucidePlus
                className="w-5 h-5 m-0 p-0"
                strokeWidth={2}
              />
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="sm:max-w-[400px]">
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Heading>
                    Создание задачи
                  </AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <Form className="flex w-full flex-col gap-4 p-2">
                    <ComboBox
                      className="w-full"
                      selectedKey={selectedPlotId}
                      onSelectionChange={async (key) => {
                        const plotId = String(key)
                        setSelectedPlotId(plotId)
                        setSelectedPlantId("")
                        await getPlantsByPlotId(plotId)

                      }}
                    >
                      <Label>Участок</Label>
                      <ComboBox.InputGroup>
                        <Input
                          placeholder="Выберите участок"
                          className="h-10 border border-gray-300"
                          value={
                            plots.find(
                              (plot) =>
                                plot.id === selectedPlotId
                            )?.name ?? ""
                          }
                          readOnly
                        />
                        <ComboBox.Trigger />
                      </ComboBox.InputGroup>
                      <ComboBox.Popover>
                        <ListBox>
                          {plots.map((plot) => (
                            <ListBox.Item
                              key={plot.id}
                              id={plot.id}
                              textValue={plot.name}
                            >
                              {plot.name}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </ComboBox.Popover>
                    </ComboBox>

                    <ComboBox
                      className="w-full"
                      selectedKey={selectedPlantId}
                      onSelectionChange={(key) =>
                        setSelectedPlantId(
                          String(key)
                        )
                      }
                    >
                      <Label>Растение</Label>
                      <ComboBox.InputGroup>
                        <Input
                          placeholder="Выберите растение"
                          className="h-10 border border-gray-300"
                          value={
                            plants.find(
                              (plant) =>
                                plant.id === selectedPlantId
                            )?.name ?? ""
                          }
                          readOnly
                        />
                        <ComboBox.Trigger />
                      </ComboBox.InputGroup>
                      <ComboBox.Popover>
                        <ListBox>
                          {plants
                            .filter(
                              (plant) =>
                                plant.garden_plot_id ===
                                selectedPlotId
                            )
                            .map((plant) => (
                              <ListBox.Item
                                key={plant.id}
                                id={plant.id}
                                textValue={plant.name}
                              >
                                {plant.name} — {plant.grade}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                        </ListBox>
                      </ComboBox.Popover>
                    </ComboBox>
                    <ComboBox
                      className="w-full"
                      selectedKey={taskTag}
                      onSelectionChange={(key) =>
                        setTaskTag(
                          String(key)
                        )
                      }
                    >
                      <Label>Тип задачи</Label>
                      <ComboBox.InputGroup>
                        <Input
                          placeholder="Выберите тег"
                          className="h-10 border border-gray-300"
                          value={
                            taskTag
                              ? TASK_VARIANTS[
                                taskTag
                                ]?.label
                              : ""
                          }
                          readOnly
                        />
                        <ComboBox.Trigger />
                      </ComboBox.InputGroup>
                      <ComboBox.Popover>
                        <ListBox>
                          {Object.entries(
                            TASK_VARIANTS
                          ).map(
                            ([tagKey, tag]) => (
                              <ListBox.Item
                                key={tagKey}
                                id={tagKey}
                                textValue={tag.label}
                              >
                                <Chip
                                  className="text-white w-full flex justify-center items-center"
                                  style={{
                                    backgroundColor:
                                    tag.color
                                  }}
                                >
                                  {tag.label}
                                </Chip>
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            )
                          )}
                        </ListBox>
                      </ComboBox.Popover>
                    </ComboBox>

                    <TextField className="flex flex-col gap-1">
                      <Label>Дата</Label>
                      <Input
                        type="date"
                        value={taskDate}
                        onChange={(e) =>
                          setTaskDate(
                            e.target.value
                          )
                        }
                        className="h-10 border border-gray-300"
                      />
                    </TextField>

                    <TextField className="flex flex-col gap-1">
                      <Label>Время</Label>
                      <Input
                        type="time"
                        value={taskTime}
                        onChange={(e) =>
                          setTaskTime(
                            e.target.value
                          )
                        }
                        className="h-10 border border-gray-300"
                      />
                    </TextField>
                  </Form>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" onClick={clearForm}>
                    Отмена
                  </Button>
                  <Button
                    slot="close"
                    onClick={handleCreateTask}
                  >
                    Создать
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </div>
      {Object.entries(groupTasksByDate(tasks.filter((task) => task.location === selectedLocation))).map(([date, tasks]) =>
        <div className='flex flex-col gap-4 mb-4'>
          <h2>{formatDate(date)}</h2>
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Table with selection"
                className="min-w-[600px]"
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                onSelectionChange={setSelectedKeys}
              >
                <Table.Header>
                  <Table.Column isRowHeader className="w-auto">Растение</Table.Column>
                  <Table.Column className="w-full">Участок</Table.Column>
                  <Table.Column className="w-full text-center">Тег</Table.Column>
                  <Table.Column className="w-auto text-center">Время</Table.Column>
                  <Table.Column className="w-auto"></Table.Column>
                </Table.Header>
                <Table.Body>
                  {tasks.filter((task) => task.location === selectedLocation).map((task) => (
                    <Table.Row key={task.id} id={task.id} >
                      <Table.Cell className={cn('w-auto', task.is_overdue ? 'text-red-700' : '')}>{task.plant_name} {task.plant_grade}</Table.Cell>
                      <Table.Cell className={cn('w-full', task.is_overdue ? 'text-red-700' : '')}>
                        {plots.find((plot) => plot.id === task.garden_plot_id)?.name}
                      </Table.Cell>
                      <Table.Cell className='w-full'>
                        <Chip className='text-white w-full flex justify-center items-center' style={{backgroundColor:TASK_VARIANTS[task.task_tag].color}}>{TASK_VARIANTS[task.task_tag].label}</Chip>
                      </Table.Cell>
                      <Table.Cell className={cn('w-auto', task.is_overdue ? 'text-red-700' : '')}>{task.task_time.slice(0, 5)}</Table.Cell>
                      <Table.Cell className="w-auto">
                        <div className="flex gap-3.5 cursor-pointer">
                          <button
                            className={cn(
                              "cursor-pointer transition-all duration-300 hover:opacity-60",
                              task.is_completed
                                ? "text-gray-400"
                                : "text-green-600"
                            )}
                            onClick={async (e) => {
                              e.stopPropagation()
                              await updateTask({
                                ...task,
                                is_completed: true
                              })
                            }}
                            disabled={task.is_completed}
                          >
                            <LucideCheck />
                          </button>
                          <AlertDialog>
                            <AlertDialog.Trigger>
                              <button
                                className="cursor-pointer transition-all duration-300 hover:opacity-60"
                                onClick={() => initTaskEdit(task)}

                              >

                                <LucideSquarePen />

                              </button>

                            </AlertDialog.Trigger>

                            <AlertDialog.Backdrop>

                              <AlertDialog.Container>

                                <AlertDialog.Dialog className="sm:max-w-[400px]">

                                  <AlertDialog.CloseTrigger />

                                  <AlertDialog.Header>

                                    <AlertDialog.Heading>
                                      Редактирование задачи
                                    </AlertDialog.Heading>

                                  </AlertDialog.Header>

                                  <AlertDialog.Body>

                                    <Form className="flex w-full flex-col gap-4 p-2">

                                      <ComboBox
                                        className="w-full"
                                        selectedKey={selectedPlotId}
                                        onSelectionChange={async (key) => {

                                          const plotId =
                                            String(key)

                                          setSelectedPlotId(
                                            plotId
                                          )

                                          await getPlantsByPlotId(
                                            plotId
                                          )
                                        }}
                                      >

                                        <Label>
                                          Участок
                                        </Label>

                                        <ComboBox.InputGroup>

                                          <Input
                                            className="h-10 border border-gray-300"
                                            value={
                                              plots.find(
                                                (plot) =>
                                                  plot.id ===
                                                  selectedPlotId
                                              )?.name ?? ""
                                            }
                                            readOnly
                                          />

                                          <ComboBox.Trigger />

                                        </ComboBox.InputGroup>

                                        <ComboBox.Popover>

                                          <ListBox>

                                            {plots.map((plot) => (

                                              <ListBox.Item
                                                key={plot.id}
                                                id={plot.id}
                                                textValue={plot.name}
                                              >

                                                {plot.name}

                                                <ListBox.ItemIndicator />

                                              </ListBox.Item>

                                            ))}

                                          </ListBox>

                                        </ComboBox.Popover>

                                      </ComboBox>


                                      <ComboBox
                                        className="w-full"
                                        selectedKey={selectedPlantId}
                                        onSelectionChange={(key) => {
                                          const plantId = String(key)
                                          setSelectedPlantId(plantId)

                                          const selectedPlant = plants.find(
                                            (plant) => plant.id === plantId
                                          )

                                          if (selectedPlant) {
                                            setTaskPlantName(selectedPlant.name)
                                            setTaskPlantGrade(selectedPlant.grade)
                                          }
                                        }}
                                      >
                                        <Label>Растение</Label>
                                        <ComboBox.InputGroup>
                                          <Input
                                            placeholder="Выберите растение"
                                            className="h-10 border border-gray-300"
                                            value={
                                              plants.find(
                                                (plant) => plant.id === selectedPlantId
                                              )?.name ?? ""
                                            }
                                            readOnly
                                          />
                                          <ComboBox.Trigger />
                                        </ComboBox.InputGroup>
                                        <ComboBox.Popover>
                                          <ListBox>
                                            {plants
                                              .filter(
                                                (plant) =>
                                                  plant.garden_plot_id === selectedPlotId
                                              )
                                              .map((plant) => (
                                                <ListBox.Item
                                                  key={plant.id}
                                                  id={plant.id}
                                                  textValue={plant.name}
                                                >
                                                  {plant.name} — {plant.grade}
                                                  <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                              ))}
                                          </ListBox>
                                        </ComboBox.Popover>
                                      </ComboBox>

                                      <ComboBox
                                        className="w-full"
                                        selectedKey={taskTag}
                                        onSelectionChange={(key) =>
                                          setTaskTag(
                                            String(key)
                                          )
                                        }
                                      >

                                        <Label>
                                          Тип задачи
                                        </Label>

                                        <ComboBox.InputGroup>

                                          <Input
                                            className="h-10 border border-gray-300"
                                            value={
                                              taskTag
                                                ? TASK_VARIANTS[
                                                  taskTag
                                                  ]?.label
                                                : ""
                                            }
                                            readOnly
                                          />

                                          <ComboBox.Trigger />

                                        </ComboBox.InputGroup>

                                        <ComboBox.Popover>

                                          <ListBox>

                                            {Object.entries(
                                              TASK_VARIANTS
                                            ).map(
                                              ([tagKey, tag]) => (

                                                <ListBox.Item
                                                  key={tagKey}
                                                  id={tagKey}
                                                  textValue={
                                                    tag.label
                                                  }
                                                >

                                                  <Chip
                                                    className="text-white w-full flex justify-center items-center"
                                                    style={{
                                                      backgroundColor:
                                                      tag.color
                                                    }}
                                                  >
                                                    {tag.label}
                                                  </Chip>

                                                  <ListBox.ItemIndicator />

                                                </ListBox.Item>

                                              )
                                            )}

                                          </ListBox>

                                        </ComboBox.Popover>

                                      </ComboBox>

                                      <TextField className="flex flex-col gap-1">

                                        <Label>
                                          Дата
                                        </Label>

                                        <Input
                                          type="date"
                                          value={taskDate}
                                          onChange={(e) =>
                                            setTaskDate(
                                              e.target.value
                                            )
                                          }
                                          className="h-10 border border-gray-300"
                                        />

                                      </TextField>

                                      <TextField className="flex flex-col gap-1">

                                        <Label>
                                          Время
                                        </Label>

                                        <Input
                                          type="time"
                                          value={taskTime}
                                          onChange={(e) =>
                                            setTaskTime(
                                              e.target.value
                                            )
                                          }
                                          className="h-10 border border-gray-300"
                                        />

                                      </TextField>

                                    </Form>

                                  </AlertDialog.Body>

                                  <AlertDialog.Footer>

                                    <Button slot="close" onClick={clearForm}>
                                      Отмена
                                    </Button>

                                    <Button
                                      slot="close"
                                      onClick={async () => {

                                        await updateTask({

                                          id: editTaskId,

                                          garden_plot_id:
                                          selectedPlotId,

                                          plant_name:
                                          taskPlantName,

                                          plant_grade:
                                          taskPlantGrade,

                                          location:
                                            selectedLocation ?? "",

                                          task_tag:
                                          taskTag,

                                          task_date:
                                          taskDate,

                                          task_time:
                                            `${taskTime}:00.000Z`,

                                          send_email_notification:
                                          sendEmailNotification,

                                          is_completed:
                                          task.is_completed
                                        })
                                        await clearForm()
                                      }}
                                    >

                                      Сохранить

                                    </Button>

                                  </AlertDialog.Footer>

                                </AlertDialog.Dialog>

                              </AlertDialog.Container>

                            </AlertDialog.Backdrop>

                          </AlertDialog>


                          <AlertDialog>

                            <AlertDialog.Trigger>

                              <button
                                className="text-red-600 transition-all cursor-pointer duration-300 hover:opacity-60"
                              >

                                <LucideTrash2 />

                              </button>

                            </AlertDialog.Trigger>

                            <AlertDialog.Backdrop>

                              <AlertDialog.Container>

                                <AlertDialog.Dialog className="sm:max-w-[350px]">

                                  <AlertDialog.Header>

                                    <AlertDialog.Heading>
                                      Удаление задачи
                                    </AlertDialog.Heading>

                                  </AlertDialog.Header>

                                  <AlertDialog.Body>

                                    Вы действительно хотите
                                    удалить эту задачу?

                                  </AlertDialog.Body>

                                  <AlertDialog.Footer>

                                    <Button slot="close">
                                      Отмена
                                    </Button>

                                    <Button
                                      slot="close"
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={async () => {

                                        await deleteTask(
                                          task.id
                                        )

                                      }}
                                    >

                                      Удалить

                                    </Button>

                                  </AlertDialog.Footer>

                                </AlertDialog.Dialog>

                              </AlertDialog.Container>

                            </AlertDialog.Backdrop>

                          </AlertDialog>

                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>


      )}
    </div>
  );
};