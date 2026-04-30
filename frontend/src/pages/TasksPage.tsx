import {Button} from "@/components/ui/Button.tsx";
import {LucidePlus, LucideSquarePen, LucideTrash2} from "lucide-react";
import type {Task} from "@/types/task.types.ts";
import { Checkbox, Table, type Selection,Chip} from "@heroui/react";
import {useState} from "react";
import {cn} from "@heroui/styles";
import {TASK_VARIANTS} from "@/constants/taskVariants.ts";
import {ActionButtons} from "@/components/ui/ActionButtons.tsx";

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
    scheduledDate: "Завтра",
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

const groupTasksByDate = (tasks:Task[]) => {
  return tasks.reduce((acc, task) => {
    const date = task.scheduledDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};

export function TasksPage(props: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  return (
    <div className='mx-auto mt-25 max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>Задачи</h1>
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
    </div>
  );
};