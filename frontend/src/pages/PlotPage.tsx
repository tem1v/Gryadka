import {Button} from "@/components/ui/Button.tsx";
import {LucideArrowLeft, LucidePlus, LucideSquarePen, LucideTrash2} from "lucide-react";
import {Link, useNavigate, useParams} from "react-router-dom";
import type {Plot} from "@/types/plot.types.ts";
import {Checkbox, Chip, type Selection, Table, Tabs} from "@heroui/react";
import {NumberField} from "@/components/ui/NumberField.tsx";
import type {Task} from "@/types/task.types.ts";
import {cn} from "@heroui/styles";
import {TASK_VARIANTS} from "@/constants/taskVariants.ts";
import {useState} from "react";

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
    photo:""
  },
  {
    id:"2",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:""
  },
  {
    id:"3",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:""
  },
  {
    id:"4",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:""
  },
  {
    id:"5",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:""
  }
]

const seeds = [
  {title: "Горох", variety:"Амброзия", id: 1, number: 10},
  {title: "Перец", variety:"Чили", id: 2, number: 12},
  {title: "Арбуз", variety:"Кримсон Свит", id: 3, number: 3},
  {title: "Тыква", variety:"Крошка", id: 4, number: 5},
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
        <button className='text-primary' onClick={()=>navigate(-1)}>
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
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="pt-4 w-full p-0" id="plants">
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
                  <Table.Column className="w-fit min-w-40 text-center">Количество</Table.Column>
                  <Table.Column className="w-auto"/>
                </Table.Header>
                <Table.Body>
                  {seeds.map((tool) => (
                    <Table.Row key={tool.id} id={tool.id}>
                      <Table.Cell>{tool.title}</Table.Cell>
                      <Table.Cell className='w-full'>{tool.variety}</Table.Cell>
                      <Table.Cell>
                        <NumberField
                          value={tool.number}
                          name={tool.title}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-3.5 cursor-pointer">
                          <button className="cursor-pointer transition-all duration-300 hover:opacity-60"><LucideSquarePen/></button>
                          <button className="text-red-600 transition-all cursor-pointer duration-300 hover:opacity-60"><LucideTrash2/></button>
                        </div>
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
        <Tabs.Panel className="pt-4 p-0" id="history">
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
                      <Table.Column className="">
                        <Checkbox aria-label="Select all" slot="selection">
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox>
                      </Table.Column>
                      <Table.Column isRowHeader className="w-auto">Растение</Table.Column>
                      <Table.Column className="w-full">Участок</Table.Column>
                      <Table.Column className="w-full text-center">Тег</Table.Column>
                      <Table.Column className="w-auto text-center">Время</Table.Column>
                      <Table.Column className="w-auto"></Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {tasks.map((task) => (
                        <Table.Row key={task.id} id={task.id} >
                          <Table.Cell className="pr-0">
                            <Checkbox
                              aria-label={`Select ${task.plant}`}
                              slot="selection"
                              variant="secondary"
                            >
                              <Checkbox.Control>
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                            </Checkbox>
                          </Table.Cell>
                          <Table.Cell className={cn('w-auto', task.isOverdue ? 'text-red-700' : '')}>{task.plant}</Table.Cell>
                          <Table.Cell className={cn('w-full', task.isOverdue ? 'text-red-700' : '')}>{task.plot}</Table.Cell>
                          <Table.Cell className='w-full'>
                            <Chip className='text-white w-full flex justify-center items-center' style={{backgroundColor:TASK_VARIANTS[task.actionTag].color}}>{task.actionTag}</Chip>
                          </Table.Cell>
                          <Table.Cell className={cn('w-auto', task.isOverdue ? 'text-red-700' : '')}>{task.scheduledTime}</Table.Cell>
                          <Table.Cell className="w-auto">
                            <div className="flex gap-3.5 cursor-pointer">
                              <button className="cursor-pointer transition-all duration-300 hover:opacity-60"><LucideSquarePen/></button>
                              <button className="text-red-600 transition-all cursor-pointer duration-300 hover:opacity-60"><LucideTrash2/></button>
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
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};