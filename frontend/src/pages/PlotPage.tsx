import {ChevronDown, LucideArrowLeft, LucidePlus} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import type {Plot} from "@/types/plot.types.ts";
import {Chip, type Selection, Table, Tabs, Button as BaseButton, Accordion} from "@heroui/react";
import {NumberField} from "@/components/ui/NumberField.tsx";
import { Button } from "@/components/ui/Button.tsx";
import type {Task} from "@/types/task.types.ts";
import {cn} from "@heroui/styles";
import {useState} from "react";
import {ActionButtons} from "@/components/ui/ActionButtons.tsx";
import {PLANT_STATUSES} from "@/constants/plantStatuses.ts";
import {TASK_VARIANTS} from "@/constants/taskVariants.ts";
import type {PlotArchive} from "@/types/plotArchive.types.ts";
import type {Plant} from "@/types/plant.types.ts";

interface Props {

};

const tasks: Task[] = [
  {
    id: "1",
    scheduledDate: "Сегодня",
    plant: "Огурцы",
    plot: "Огород",
    actionTag: "Полив",
    description: "Что-то сделать",
    scheduledTime: "12:00",
    isCompleted: false,
    isOverdue: true,
  },
  {
    id: "2",
    scheduledDate: "Сегодня",
    plant: "Помидоры",
    plot: "Огород за сараем",
    actionTag: "Сбор",
    description: "Собрать и помыть",
    scheduledTime: "13:00",
    isCompleted: false,
    isOverdue: false,
  },
  {
    id: "3",
    scheduledDate: "Вчера",
    plant: "Огурец",
    plot: "Огород",
    actionTag: "Полив",
    description: "Что-то сделать",
    scheduledTime: "12:00",
    isCompleted: false,
    isOverdue: false,
  },
  {
    id: "4",
    scheduledDate: "16-05-2026",
    plant: "Огурец",
    plot: "Огород",
    actionTag: "Полив",
    description: "Что-то сделать",
    scheduledTime: "12:00",
    isCompleted: false,
    isOverdue: false,
  }
];

const mockPlots:Plot[] = [
  {
    id:"1",
    title:"Огород за окном",
    createdAt: "2026-06-01",
    photo:"",
    closedAt:"2026-09-01",
  },
  {
    id:"2",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:"",
    closedAt:"2026-09-01"
  },
  {
    id:"3",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:"",
    closedAt:"2026-09-01"
  },
  {
    id:"4",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:"",
    closedAt:"2026-09-01"
  },
  {
    id:"5",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:"",
    closedAt:"2026-09-01"
  }
]


const mockPlotsArchive:PlotArchive[] = [
  {
    id:"1",
    gardenId:"1",
    createdAt: "2026-06-01",
    closedAt:"2026-09-01",
    archivedPlants:[
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
    ]
  },
  {
    id:"1",
    gardenId:"1",
    createdAt: "2026-06-01",
    closedAt:"2026-09-01",
    archivedPlants:[
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
    ]
  },
  {
    id:"1",
    gardenId:"1",
    createdAt: "2026-06-01",
    closedAt:"2026-09-01",
    archivedPlants:[
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
    ]
  },
  {
    id:"1",
    gardenId:"1",
    createdAt: "2026-06-01",
    closedAt:"2026-09-01",
    archivedPlants:[
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
    ]
  },
  {
    id:"1",
    gardenId:"1",
    createdAt: "2026-06-01",
    closedAt:"2026-09-01",
    archivedPlants:[
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
      {
        id: "1",
        plotId: "1",
        name: "Тыква",
        grade: "Крошка",
        quality: 12,
        status: "Убрано",
        createdAt: "12-08-2026",
        totalYield: 13,
      },
    ]
  }
]

const plants:Plant[] = [

  {name: "Горох", grade:"Амброзия", id: "1",plotId: "1", quality: 10, status:"В грунте", createdAt: "12-08-2026", totalYield: 13,},
  {name: "Перец", grade:"Чили", id: "2",plotId: "1", quality: 12, status:"Болеет", createdAt: "12-08-2026", totalYield: 13,},
  {name: "Арбуз", grade:"Кримсон Свит", id: "3", plotId: "1", quality: 3, status:"Убрано", createdAt: "12-08-2026", totalYield: 13,},
  {name: "Тыква", grade:"Крошка", id: "4",plotId: "1", quality: 5, status:"Плодоносит", createdAt: "12-08-2026", totalYield: 13,},
];

const groupTasksByDate = (tasks:Task[]) => {
  return tasks.reduce((acc, task) => {
    const date = task.scheduledDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};

export function PlotPage(props: Props) {
  const { id } = useParams<{ id: string}>();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  return (
    <div className='mx-auto w-full mt-25 max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>{mockPlots.find(plot => plot.id === id)?.title}</h1>
        <button className='text-primary cursor-pointer' onClick={()=>navigate(-1)}>
          <LucideArrowLeft className="m-0 p-0 hover:opacity-80 duration-300 transition-opacity" strokeWidth={2} size={40}/>
        </button>
      </div>
      <Tabs className="w-full" defaultSelectedKey='plants'>
        <Tabs.ListContainer className='max-w-md '>
          <Tabs.List aria-label="Plot" className="bg-white">
            <Tabs.Tab id="plants" className="data-[selected=true]:text-white">
              Растения
              <Tabs.Indicator className='bg-primary' />
            </Tabs.Tab>
            <Tabs.Tab id="history" className="data-[selected=true]:text-white">
              Действия
              <Tabs.Indicator className='bg-primary'/>
            </Tabs.Tab>
            <Tabs.Tab id="archive" className="data-[selected=true]:text-white">
              Архив
              <Tabs.Indicator className='bg-primary' />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="pt-4 w-full p-0 relative" id="plants">
          <div className='absolute right-0 -top-12.5'>
            <Button>
              <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
            </Button>
          </div>
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Table with selection"
                className="min-w-[600px]"
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={setSelectedKeys}
              >
                <Table.Header>
                  <Table.Column isRowHeader className="w-auto">Название</Table.Column>
                  <Table.Column isRowHeader className="w-full">Сорт</Table.Column>
                  <Table.Column isRowHeader className="w-full text-center">Статус</Table.Column>
                  <Table.Column className="w-fit min-w-40 text-center">Количество</Table.Column>
                  <Table.Column className="w-fit min-w-40 text-center">Урожай</Table.Column>
                  <Table.Column className="w-auto"/>
                </Table.Header>
                <Table.Body>
                  {plants.map((plant) => (
                    <Table.Row key={plant.id} id={plant.id}  onClick={() => navigate(`plant/${plant.id}`)} className="cursor-pointer">
                      <Table.Cell>{plant.name}</Table.Cell>
                      <Table.Cell className='w-full'>{plant.grade}</Table.Cell>
                      <Table.Cell className='w-auto'>
                        <Chip className='text-white w-full flex justify-center items-center' style={{backgroundColor:PLANT_STATUSES[plant.status].color}}>{plant.status}</Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <NumberField
                          value={plant.quality}
                          name={plant.name}
                        />
                      </Table.Cell>
                      <Table.Cell className='text-center'>
                        {plant.totalYield} кг
                      </Table.Cell>
                      <Table.Cell>
                        <ActionButtons/> {/*TODO не забыть прописать функции*/}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
          <p className="text-sm text-muted">
            Выбрано:{" "}
            <span className="font-medium">
          {selectedKeys === "all"
            ? "все"
            : selectedKeys.size > 0
              ? Array.from(selectedKeys).join(", ")
              : "ничего"}
        </span>
          </p>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4 p-0 relative" id="history">
          <div className='absolute right-0 -top-12.5'>
            <Button>
              <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
            </Button>
          </div>
          {Object.entries(groupTasksByDate(tasks)).map(([date, tasks]) =>
            <div className='flex flex-col gap-4 mb-4'>
              <h2>{date}</h2>
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
                      <Table.Column className="w-auto">Участок</Table.Column>
                      <Table.Column className="w-auto text-center">Тег</Table.Column>
                      <Table.Column className="w-full"></Table.Column>
                      <Table.Column className="w-full"></Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {tasks.map((task) => (
                        <Table.Row key={task.id} id={task.id}>
                          <Table.Cell
                            className={cn('w-auto', task.isOverdue ? 'text-red-700' : '')}>{task.plant}</Table.Cell>
                          <Table.Cell
                            className={cn('w-auto', task.isOverdue ? 'text-red-700' : '')}>{task.plot}</Table.Cell>
                          <Table.Cell className='w-auto'>
                            <Chip className='text-white w-full flex justify-center items-center'
                                  style={{backgroundColor: TASK_VARIANTS[task.actionTag].color}}>{task.actionTag}</Chip>
                          </Table.Cell>
                          <Table.Cell className="w-full"/>
                          <Table.Cell className="w-full">
                            <ActionButtons/>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          )}
        </Tabs.Panel>
        <Tabs.Panel className="pt-4 w-full p-0 relative" id="archive">
          <Accordion className="w-full" hideSeparator>
            {mockPlotsArchive.map((item, index) => (
              <Accordion.Item key={index}>
                <Accordion.Heading>
                  <Accordion.Trigger >
                    <h2>{item.createdAt} - {item.closedAt}</h2>
                    <Accordion.Indicator className='text-primary'>
                      <ChevronDown />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Table>
                    <Table.ScrollContainer>
                      <Table.Content
                        aria-label="Table with selection"
                        className="min-w-[600px]"
                        selectedKeys={selectedKeys}
                        selectionMode="single"
                        onSelectionChange={setSelectedKeys}
                      >
                        <Table.Header>
                          <Table.Column isRowHeader className="w-auto">Название</Table.Column>
                          <Table.Column isRowHeader className="w-full">Сорт</Table.Column>
                          <Table.Column isRowHeader className="w-full text-center">Статус</Table.Column>
                          <Table.Column className="w-fit min-w-40 text-center">Количество</Table.Column>
                          <Table.Column className="w-fit min-w-40 text-center">Урожай</Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {item.archivedPlants.map((plant) => (
                            <Table.Row key={plant.id} id={plant.id}  onClick={() => navigate(`plant/${plant.id}`)} className="cursor-pointer">
                              <Table.Cell>{plant.name}</Table.Cell>
                              <Table.Cell className='w-full'>{plant.grade}</Table.Cell>
                              <Table.Cell className='w-auto'>
                                <Chip className='text-white w-full flex justify-center items-center' style={{backgroundColor:PLANT_STATUSES[plant.status].color}}>{plant.status}</Chip>
                              </Table.Cell>
                              <Table.Cell className='text-center'>
                                {plant.quality}
                              </Table.Cell>
                              <Table.Cell className='text-center'>
                                {plant.totalYield} кг
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Content>
                    </Table.ScrollContainer>
                  </Table>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Tabs.Panel>
      </Tabs>
      <BaseButton className='mt-5 text-white bg-red-600 rounded-xl px-5 py-5.5 transition-all duration-300 hover:opacity-80 hover:scale-102'>Завершить сезон</BaseButton>
    </div>
  );
};