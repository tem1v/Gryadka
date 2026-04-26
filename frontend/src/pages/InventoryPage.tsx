import {Button} from "@/components/ui/Button.tsx";
import {LucidePlus, LucideSquarePen, LucideTrash2} from "lucide-react";
import { Tabs, Table, Checkbox, type Selection } from '@heroui/react';
import {useState} from "react";
import {NumberField} from "@/components/ui/NumberField.tsx";

interface Props {

};

const tools = [
  {title: "Лопата", id: 1, number: 1},
  {title: "Грабли", id: 2, number: 2},
  {title: "Тяпка", id: 3, number: 2},
  {title: "Ведро 10 л", id: 4, number: 2},
];

const seeds = [
  {title: "Горох", variety:"Амброзия", id: 1, number: 10},
  {title: "Перец", variety:"Чили", id: 2, number: 12},
  {title: "Арбуз", variety:"Кримсон Свит", id: 3, number: 3},
  {title: "Тыква", variety:"Крошка", id: 4, number: 5},
];

const fertilizers = [
  {title: "Гумат аммония", type:"Азотное", id: 1, number: 1},
  {title: "Сульфат калия", type:"Калийное", id: 2, number: 2},
  {title: "Аммофос", type:"Фосфорное", id: 3, number: 2},
  {title: "Навоз", type:"Органическое", id: 4, number: 2},
];

export function InventoryPage(props: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  return (
    <div className='mx-auto mt-25 w-full max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>Инвентарь</h1>
        <Button>
          <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
        </Button>
      </div>
      <Tabs className="w-full" defaultSelectedKey='tools'>
        <Tabs.ListContainer className='max-w-md '>
          <Tabs.List aria-label="Инвентарь" className="bg-white">
            <Tabs.Tab id="tools" className="data-[selected=true]:text-white">
              Инструменты
              <Tabs.Indicator className='bg-primary' />
            </Tabs.Tab>
            <Tabs.Tab id="seeds" className="data-[selected=true]:text-white">
              Семена
              <Tabs.Indicator className='bg-primary'/>
            </Tabs.Tab>
            <Tabs.Tab id="fertilizers" className="data-[selected=true]:text-white">
              Удобрения
              <Tabs.Indicator className='bg-primary'/>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="pt-4 w-full p-0" id="tools">
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
                  <Table.Column isRowHeader className="w-full">Название</Table.Column>
                  <Table.Column className="w-fit min-w-40 text-center">Количество</Table.Column>
                  <Table.Column className="w-auto"/>
                </Table.Header>
                <Table.Body>
                  {tools.map((tool) => (
                    <Table.Row key={tool.id} id={tool.id}>
                      <Table.Cell>{tool.title}</Table.Cell>
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
        <Tabs.Panel className="pt-4 p-0" id="seeds">
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
                  <Table.Column className="w-fit max-w-40 text-center">Количество(упак.)</Table.Column>
                  <Table.Column className="w-auto"/>
                </Table.Header>
                <Table.Body>
                  {seeds.map((seed) => (
                    <Table.Row key={seed.id} id={seed.id}>
                      <Table.Cell>{seed.title}</Table.Cell>
                      <Table.Cell>{seed.variety}</Table.Cell>
                      <Table.Cell>
                        <NumberField
                          value={seed.number}
                          name={seed.title}
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
        </Tabs.Panel>
        <Tabs.Panel className="pt-4 p-0" id="fertilizers">
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Table with selection"
                className=""
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={setSelectedKeys}
              >
                <Table.Header>
                  <Table.Column isRowHeader className="w-auto">Название</Table.Column>
                  <Table.Column isRowHeader className="w-full">Тип</Table.Column>
                  <Table.Column className="w-fit min-w-40 text-center">Количество</Table.Column>
                  <Table.Column className="w-auto"/>
                </Table.Header>
                <Table.Body>
                  {fertilizers.map((fertilizer) => (
                    <Table.Row key={fertilizer.id} id={fertilizer.id}>
                      <Table.Cell>{fertilizer.title}</Table.Cell>
                      <Table.Cell>{fertilizer.type}</Table.Cell>
                      <Table.Cell>
                        <NumberField
                          value={fertilizer.number}
                          name={fertilizer.title}
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
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};