import {ChevronDown, LucideArrowLeft, LucidePlus, LucideSquarePen, LucideTrash2} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import type {Plot} from "@/types/plot.types.ts";
import {
  Chip,
  type Selection,
  Table,
  Tabs,
  Button as BaseButton,
  Accordion,
  AlertDialog,
  Form,
  TextField, Label, Input, ComboBox, ListBox
} from "@heroui/react";
import { Button } from "@/components/ui/Button.tsx";
import type {Task} from "@/types/task.types.ts";
import {type Key, useEffect, useMemo, useState} from "react";
import {PLANT_STATUSES} from "@/constants/plantStatuses.ts";
import type {PlotArchive} from "@/types/plotArchive.types.ts";
import type {Plant} from "@/types/plant.types.ts";
import {usePlotsStore} from "@/store/plots.store.ts";
import {usePlantsStore} from "@/store/plants.store.ts";
import {useArchivesStore} from "@/store/archives.store.ts";
import {formatDate} from "@/utils/formatDate.ts";

interface Props {

};


export function PlotPage(props: Props) {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [plantName, setPlantName] = useState<string>('');
  const [plantGrade, setPlantGrade] = useState<string>('');
  const [plantQuantity, setPlantQuantity] = useState<string>('');
  const [plantStatus, setPlantStatus] = useState<string>('');
  const [editPlantName, setEditPlantName] = useState<string>(plantName);
  const [editPlantGrade, setEditPlantGrade] = useState<string>(plantGrade);
  const [editPlantQuantity, setEditPlantQuantity] = useState<string>(plantQuantity);
  const [editPlantStatus, setEditPlantStatus] = useState<string>(plantStatus);
  const [archiveName, setArchiveName] = useState<string>('');
  const plot = usePlotsStore((state) => state.plot);
  const plants = usePlantsStore(
    (state) => state.plants
  )
  const createPlant = usePlantsStore((state) => state.createPlant);
  const deletePlant = usePlantsStore(
    (state) => state.deletePlant
  )
  const getPlot = usePlotsStore(
    (state) => state.getPlotByiId
  )
  const updatePlant = usePlantsStore(
    (state) => state.updatePlant
  )
  const getPlantsByPlot =
    usePlantsStore(
      (state) => state.getPlantsByPlot
    )

  const archives = useArchivesStore(
    (state) => state.archives
  )

  const getArchivesByPlot =
    useArchivesStore(
      (state) => state.getArchivesByPlot
    )
  const createArchive = useArchivesStore(
    (state) => state.createArchive
  )
  const handleCreateArchive = async () => {
    await createArchive({
      id:id!,
      name:archiveName,
    })

    clearForm()
  }


  useEffect(() => {

    if (id) {
      getPlantsByPlot(id)
    }

  }, [id, getPlantsByPlot])

  useEffect(() => {
    getPlot(id)
    getArchivesByPlot(id)
  }, [id])
  const handleCreatePlant = async () => {
    if (!plantName || !plantGrade || !plantQuantity) return
    await createPlant({
      garden_plot_id: id!,
      name: plantName!,
      grade: plantGrade!,
      quantity: +plantQuantity!,
      status_plant:plantStatus!,
    })

    clearForm()
  }
  const handleDeletePlant = async (plantId:string) => {
    await deletePlant(plantId)
  }
  const handleSavePlant = async (plantId:string) => {
    await updatePlant({
      id: plantId,
      garden_plot_id: id,
      name:editPlantName,
      grade:editPlantGrade,
      quantity:+editPlantQuantity,
      status_plant:editPlantStatus,
    })
  }
  const clearForm = async () => {
    setPlantName('');
    setPlantGrade('');
    setPlantQuantity('');
    setPlantStatus('');
    setArchiveName('')
  }
  const openEditModal = (plant: Plant) => {

    setEditPlantName(plant.name)

    setEditPlantGrade(plant.grade)

    setEditPlantQuantity(String(plant.quantity))

    setEditPlantStatus(plant.status)

  }
  return (
    <div className='mx-auto w-full mt-25 max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>{plot?.name}</h1>
        <button className='text-primary cursor-pointer' onClick={()=>navigate(-1)}>
          <LucideArrowLeft className="m-0 p-0 hover:opacity-80 duration-300 transition-opacity" strokeWidth={2} size={40}/>
        </button>
      </div>
      <Tabs className="w-full" defaultSelectedKey='plants'>
        <Tabs.ListContainer className='max-w-sm '>
          <Tabs.List aria-label="Plot" className="bg-white">
            <Tabs.Tab id="plants" className="data-[selected=true]:text-white">
              Растения
              <Tabs.Indicator className='bg-primary' />
            </Tabs.Tab>
            <Tabs.Tab id="archive" className="data-[selected=true]:text-white">
              Архив
              <Tabs.Indicator className='bg-primary' />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="pt-4 w-full p-0 relative" id="plants">
          <div className='absolute right-0 -top-12.5'>
            <AlertDialog>
              <AlertDialog.Trigger>
                <Button>
                  <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Backdrop>
                <AlertDialog.Container>
                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                    <AlertDialog.CloseTrigger onClick={clearForm}/>
                    <AlertDialog.Header>
                      <AlertDialog.Heading>Создание растения</AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <Form className="flex w-full flex-col gap-4 p-2">
                        <TextField className="flex flex-col gap-1">
                          <Label htmlFor="input-type-text">Название</Label>
                          <Input id="input-type-text" placeholder="Помидор" type="text"
                                 value={plantName}
                                 onChange={(e) => setPlantName(e.target.value)}
                                 className='h-10 border border-gray-300'/>
                        </TextField>
                        <TextField className="flex flex-col gap-1">
                          <Label htmlFor="input-type-text">Сорт</Label>
                          <Input id="input-type-text" placeholder="Черри" type="text"
                                 value={plantGrade}
                                 onChange={(e) => setPlantGrade(e.target.value)}
                                 className='h-10 border border-gray-300'/>
                        </TextField>
                        <TextField className="flex flex-col gap-1">
                          <Label htmlFor="input-type-text">Количество</Label>
                          <Input id="input-type-text" placeholder="0" type="number"
                                 value={plantQuantity ?? ''}
                                 onChange={(e) => setPlantQuantity(e.target.value)}
                                 className='h-10 border border-gray-300'/>
                        </TextField>
                        <ComboBox
                          className="w-full"
                          selectedKey={plantStatus}
                          onSelectionChange={(key) => setPlantStatus(key)}
                        >
                          <Label>Статус</Label>
                          <ComboBox.InputGroup>
                            <Input
                              placeholder="Выберите статус"
                              className="h-10 border border-gray-300"
                              value={
                                plantStatus
                                  ? PLANT_STATUSES[plantStatus]?.label
                                  : ""
                              }
                              onChange={(e) => setPlantStatus(e.target.value)}
                            />
                            <ComboBox.Trigger />
                          </ComboBox.InputGroup>
                          <ComboBox.Popover>
                            <ListBox>
                              {Object.entries(PLANT_STATUSES).map(
                                ([statusKey, status]) => (
                                  <ListBox.Item
                                    key={statusKey}
                                    id={statusKey}
                                    textValue={status.label}
                                  >
                                    <Chip className='text-white w-full flex justify-center items-center' style={{backgroundColor:status.color}}>{status.label}</Chip>
                                    <ListBox.ItemIndicator />
                                  </ListBox.Item>
                                )
                              )}
                            </ListBox>
                          </ComboBox.Popover>
                        </ComboBox>
                      </Form>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button slot="close" onClick={clearForm}>
                        Отмена
                      </Button>
                      <Button slot="close" onClick={handleCreatePlant}>
                        Создать
                      </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
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
                  <Table.Column isRowHeader className="w-auto min-w-30 text-center">Статус</Table.Column>
                  <Table.Column className="w-fit min-w-40 text-center">Количество</Table.Column>
                  <Table.Column className="w-fit min-w-40 text-center">Урожай</Table.Column>
                  <Table.Column className="w-auto"/>
                </Table.Header>
                <Table.Body>
                  {plants.map((plant) => (
                    <Table.Row key={plant.id} id={plant.id}  onClick={() => navigate(`/plots/${id}/plant/${plant.id}`)} className="cursor-pointer">
                      <Table.Cell>{plant.name}</Table.Cell>
                      <Table.Cell className='w-full'>{plant.grade}</Table.Cell>
                      <Table.Cell className='w-auto'>
                        <Chip className='text-white w-full flex justify-center items-center' style={{backgroundColor:PLANT_STATUSES[plant.status]?.color || "#999"}}>{PLANT_STATUSES[plant.status].label}</Chip>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        {plant.quantity}
                      </Table.Cell>
                      <Table.Cell className='text-center'>
                        {plant.total_yield_amount} кг
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-3.5">
                          <AlertDialog>
                            <AlertDialog.Trigger>
                              <button className="cursor-pointer transition-all duration-300 hover:opacity-60" onClick={() => openEditModal(plant)}>
                                <LucideSquarePen />
                              </button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Heading>
                                      Редактирование растения
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <Form className="flex w-full flex-col gap-4 p-2">
                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Название</Label>
                                        <Input id="input-type-text" placeholder="Помидор" type="text"
                                               value={editPlantName}
                                               onChange={(e) => setEditPlantName(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Сорт</Label>
                                        <Input id="input-type-text" placeholder="Черри" type="text"
                                               value={editPlantGrade}
                                               onChange={(e) => setEditPlantGrade(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Количество</Label>
                                        <Input id="input-type-text" placeholder="0" type="number"
                                               value={String(editPlantQuantity)}
                                               onChange={(e) => setEditPlantQuantity(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                      <ComboBox
                                        className="w-full"
                                        selectedKey={editPlantStatus}
                                        onSelectionChange={(key) => setEditPlantStatus(key)}
                                      >
                                        <Label>Статус</Label>
                                        <ComboBox.InputGroup>
                                          <Input
                                            placeholder="Выберите статус"
                                            className="h-10 border border-gray-300"
                                            value={
                                              editPlantStatus
                                                ? PLANT_STATUSES[editPlantStatus]?.label
                                                : ""
                                            }
                                            onChange={(e) => setPlantStatus(e.target.value)}
                                          />
                                          <ComboBox.Trigger />
                                        </ComboBox.InputGroup>
                                        <ComboBox.Popover>
                                          <ListBox>
                                            {Object.entries(PLANT_STATUSES).map(
                                              ([statusKey, status]) => (
                                                <ListBox.Item
                                                  key={statusKey}
                                                  id={statusKey}
                                                  textValue={status.label}
                                                >
                                                  <Chip className='text-white w-full flex justify-center items-center' style={{backgroundColor:status.color}}>{status.label}</Chip>
                                                  <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                              )
                                            )}
                                          </ListBox>
                                        </ComboBox.Popover>
                                      </ComboBox>
                                    </Form>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close" onClick={clearForm}>
                                      Отмена
                                    </Button>
                                    <Button
                                      slot="close"
                                      onClick={()=>handleSavePlant(plant.id)}
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
                              <button className="text-red-600 transition-all cursor-pointer duration-300 hover:opacity-60">
                                <LucideTrash2 />
                              </button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Heading>
                                      Удаление растения
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <p>
                                      Вы уверены, что хотите удалить
                                      <span className="font-semibold">
                                      {" "}
                                        {plant.name} {plant.grade}
                                      </span>
                                      ?
                                    </p>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close">
                                      Отмена
                                    </Button>
                                    <Button
                                      slot="close"
                                      onClick={() => handleDeletePlant(plant.id)}
                                      className="bg-red-600 hover:bg-red-700"
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
        </Tabs.Panel>
        <Tabs.Panel className="pt-4 w-full p-0 relative" id="archive">
          <Accordion className="w-full" hideSeparator>
            {archives.map((item, index) => (
              <Accordion.Item key={index}>
                <Accordion.Heading>
                  <Accordion.Trigger >
                    <h2>{formatDate(item.start_date)} - {formatDate(item.end_date)} ({item.name})</h2>
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
                          {item.plants.map((plant) => (
                            <Table.Row key={plant.id} id={plant.id} className="cursor-pointer">
                              <Table.Cell>{plant.name}</Table.Cell>
                              <Table.Cell className='w-full'>{plant.grade}</Table.Cell>
                              <Table.Cell className='w-auto'>
                                <Chip className='text-white w-full flex justify-center items-center' style={{backgroundColor:PLANT_STATUSES[plant.status]?.color || "#999"}}>{PLANT_STATUSES[plant.status]?.label}</Chip>
                              </Table.Cell>
                              <Table.Cell className='text-center'>
                                {plant.quantity}
                              </Table.Cell>
                              <Table.Cell className='text-center'>
                                {plant.total_yield_amount} кг
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
      <AlertDialog>
        <AlertDialog.Trigger aria-disabled={plants.length === 0}>
          <BaseButton
            className='mt-5 text-white bg-red-600 rounded-xl px-5 py-5.5 transition-all duration-300 hover:opacity-80 hover:scale-102'
            isDisabled={plants.length === 0}
          >
            Завершить сезон
          </BaseButton>
        </AlertDialog.Trigger>
        <AlertDialog.Backdrop>
          <AlertDialog.Container placement='center'>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger onClick={()=>clearForm()} />
              <AlertDialog.Header>
                <AlertDialog.Heading>
                  Завершение сезона
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  Все растения этого участка будут перенесены в архив
                </p>
                <TextField className="flex flex-col gap-1">
                  <Label htmlFor="input-type-text">Название</Label>
                  <Input id="input-type-text" placeholder="Удачный сезон" type="text"
                         value={archiveName}
                         onChange={(e) => setArchiveName(e.target.value)}
                         className='h-10 border border-gray-300'/>
                </TextField>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" onClick={()=>clearForm()}>
                  Отмена
                </Button>
                <Button
                  slot="close"
                  onClick={handleCreateArchive}
                >
                  Перенести
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
};