import {useNavigate, useParams} from "react-router-dom";
import {LucideArrowLeft, LucidePlus} from "lucide-react";
import {Card, Chip, type Selection, Table, Tabs} from "@heroui/react";
import {PLANT_STATUSES} from "@/constants/plantStatuses.ts";
import {NumberField} from "@/components/ui/NumberField.tsx";
import {ActionButtons} from "@/components/ui/ActionButtons.tsx";
import {cn} from "@heroui/styles";
import {TASK_VARIANTS} from "@/constants/taskVariants.ts";
import type {Task} from "@/types/task.types.ts";
import {useState} from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {Button} from "@/components/ui/Button.tsx";

interface Props {

};

const data = [
  {
    name: '2021',
    pv: 2400,
  },
  {
    name: '2022',
    pv: 1398,
  },
  {
    name: '2023',
    pv: 9800,
  },
  {
    name: '2024',
    pv: 3908,
  },
  {
    name: '2025',
    pv: 4800,
  },
  {
    name: '2026',
    pv: 3800,
  },
];

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

const seeds = [
  {title: "Горох", variety:"Амброзия", id: 1, number: 10, status:"В грунте"},
  {title: "Перец", variety:"Чили", id: 2, number: 12, status:"Болеет"},
  {title: "Арбуз", variety:"Кримсон Свит", id: 3, number: 3, status:"Убрано"},
  {title: "Тыква", variety:"Крошка", id: 4, number: 5, status:"Плодоносит"},
];

const harvest = [
  {
    id:1,
    date: "12-07-2026",
    weight: 0.5
  },
  {
    id:2,
    date: "12-07-2026",
    weight: 0.5
  },
  {
    id:3,
    date: "12-07-2026",
    weight: 0.5
  },
  {
    id:4,
    date: "12-07-2026",
    weight: 0.5
  }
]

const album = [
  {
    id: 1,
    photo:"../../../public/plot2.jpg",
    description: "Растут мои помидорки",
    tag: "hz",
    date:'',
  },
  {
    id: 2,
    photo:"../../../public/plot2.jpg",
    description: "Растут мои помидорки",
    tag: "hz",
    date:'',
  },
  {
    id: 3,
    photo:"../../../public/plot2.jpg",
    description: "Растут мои помидорки",
    tag: "hz",
    date:'',
  },
  {
    id: 4,
    photo:"../../../public/plot2.jpg",
    description: "Растут мои помидорки",
    tag: "hz",
    date:'',
  },
  {
    id: 5,
    photo:"../../../public/plot2.jpg",
    description: "Растут мои помидорки",
    tag: "hz",
    date:'',
  }
]

const groupTasksByDate = (tasks:Task[]) => {
  return tasks.reduce((acc, task) => {
    const date = task.scheduledDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};

export function PlantPage(props: Props) {
  const { id } = useParams<{ id: string}>();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const navigate = useNavigate();
  return (
    <div className='mx-auto w-full mt-25 max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>{seeds.find(plant => plant.id === +id)?.title}</h1>
        <button className='text-primary cursor-pointer' onClick={()=>navigate(-1)}>
          <LucideArrowLeft className="m-0 p-0 hover:opacity-80 duration-300 transition-opacity" strokeWidth={2} size={40}/>
        </button>
      </div>
      <Tabs className="w-full" defaultSelectedKey='plants'>
        <Tabs.ListContainer className='max-w-md '>
          <Tabs.List aria-label="Plant" className="bg-white">
            <Tabs.Tab id="history" className="data-[selected=true]:text-white">
              Действия
              <Tabs.Indicator className='bg-primary' />
            </Tabs.Tab>
            <Tabs.Tab id="harvest" className="data-[selected=true]:text-white">
              Урожай
              <Tabs.Indicator className='bg-primary'/>
            </Tabs.Tab>
            <Tabs.Tab id="album" className="data-[selected=true]:text-white">
              Альбом
              <Tabs.Indicator className='bg-primary'/>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="pt-4 w-full p-0 relative" id="history">
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
        <Tabs.Panel className="pt-4 w-full p-0 relative" id="harvest">
          <div className='absolute right-0 -top-12.5'>
            <Button>
              <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
            </Button>
          </div>
          <div className='flex w-full mb-5'>
            <Card className='w-full h-full flex justify-center items-center'>
              <BarChart
                className='bg-white'
                style={{width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618}}
                responsive
                data={data}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid/>
                <XAxis dataKey="name"/>
                <YAxis width="auto"/>
                <Tooltip/>
                <Bar dataKey="pv" fill="var(--color-primary)" activeBar={{fill: '#1d5100'}} radius={[40, 40, 0, 0]}/>
              </BarChart>
            </Card>
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
                    <Table.Column isRowHeader className="min-w-[120px] text-center">Дата</Table.Column>
                    <Table.Column className="min-w-[100px] text-center">Вес</Table.Column>
                    <Table.Column className="w-full"></Table.Column>
                    <Table.Column className="w-auto"></Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {harvest.map((item) => (
                      <Table.Row key={item.date} id={item.id}>
                        <Table.Cell
                          className={cn('min-w-[100px] text-center')}>{item.date}</Table.Cell>
                        <Table.Cell
                          className={cn('min-w-[100px] text-center')}>{item.weight} кг</Table.Cell>
                        <Table.Cell className="w-full"/>
                        <Table.Cell className="w-auto">
                          <ActionButtons/>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4 w-full p-0 relative" id="album">
          <div className='absolute right-0 -top-12.5'>
            <Button>
              <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-x-2 gap-y-2 w-fit mx-auto'>
            {album.map((item) => (
              <Card className='p-0 w-fit relative duration-300 hover:scale-102 cursor-pointer'>
                <img src={item.photo} alt={item.description} className='w-80 h-80'/>
                <div className='absolute right-2 top-2'>{item.tag}</div>
              </Card>
            ))}
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};