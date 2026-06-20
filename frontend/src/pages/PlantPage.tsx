import {useNavigate, useParams} from "react-router-dom";
import {LucideArrowLeft, LucidePlus, LucideTrash2} from "lucide-react";
import {
  AlertDialog,
  Card,
  Chip,
  Form,
  Input,
  Label,
  type Selection,
  Table,
  Tabs, TextField
} from "@heroui/react";
import {cn} from "@heroui/styles";
import {TASK_VARIANTS} from "@/constants/taskVariants.ts";
import type {Task} from "@/types/task.types.ts";
import {useEffect, useRef, useState} from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {Button} from "@/components/ui/Button.tsx";
import {useTasksStore} from "@/store/tasks.store.ts";
import {formatDate} from "@/utils/formatDate.ts";
import {useAuthStore} from "@/store/auth.store.ts";
import {usePlantsStore} from "@/store/plants.store.ts";
import {useArchivesStore} from "@/store/archives.store.ts";
import {useHarvestsStore} from "@/store/harvest.store.ts";
import type {PlantPhoto} from "@/types/plant.types.ts";
import {usePlantPhotosStore} from "@/store/photo.store.ts";

interface Props {

};

export function PlantPage(props: Props) {
  const { plotId, plantId } = useParams<{ plotId:string, plantId: string}>();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [harvestValue, setHarvestValue] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const navigate = useNavigate();
  const [openedPhoto, setOpenedPhoto] = useState<PlantPhoto | null>(null);
  const selectedLocation = useAuthStore((state) => state.selectedLocation)
  const plants = usePlantsStore(
    (state) => state.plants
  )
  const currentPlant = plants.find(
    (p) => p.id === plantId
  )
  const tasks = useTasksStore((state) => state.tasks)
    .filter((task) =>
      task.is_completed &&
      task.location === selectedLocation &&
      task.garden_plot_id === plotId &&
      task.plant_name === currentPlant?.name &&
      task.plant_grade === currentPlant?.grade
    )
    .sort((a, b) => {

      const dateA = new Date(
        `${a.task_date}T${a.task_time}`
      ).getTime()

      const dateB = new Date(
        `${b.task_date}T${b.task_time}`
      ).getTime()

      return dateB - dateA
    })
  const getPlantsByPlotId = usePlantsStore((state)=>state.getPlantsByPlot)

  const getTasks = useTasksStore(
    (state) => state.getTasks
  )

  const chartData = useArchivesStore(
    (state) => state.chartData
  )

  const getArchiveChartData =
    useArchivesStore(
      (state) => state.getArchiveChartData
    )
  const harvests = useHarvestsStore(
    (state) => state.harvests
  ).sort((a,b) => {
    const dateA = new Date(a.harvest_date).getTime()
    const dateB = new Date(b.harvest_date).getTime()
    return dateB - dateA
  })

  const getHarvestsByPlant =
    useHarvestsStore(
      (state) => state.getHarvestsByPlant
    )

  const createHarvest =
    useHarvestsStore(
      (state) => state.createHarvest
    )

  const deleteHarvest =
    useHarvestsStore(
      (state) => state.deleteHarvest
    )
  const clearForm = () => {
    setHarvestValue('')
    setHarvestDate('')
  }

  const handleCreateHarvest = async () => {
    await createHarvest({
      weight:+harvestValue,
      harvest_date:harvestDate,
      plant_id:plantId!
    })
    clearForm()
  }

  useEffect(() => {
    getTasks()
    getPlantsByPlotId(plotId!)
    getHarvestsByPlant(plantId!)

  }, [plotId])
  useEffect(() => {
    getArchiveChartData(plantId!)
  }, [harvests]);

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click()
  }
  const createPlantPhoto = usePlantPhotosStore((state) => state.createPlantPhoto)
  const deletePlantPhoto =
    usePlantPhotosStore(
      (state) =>
        state.deletePlantPhoto
    )

  const handleSelectImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (!file) return

    await createPlantPhoto(
      plantId!,
      file
    )
    await getPlantsByPlotId(plotId!)
  }
  return (
    <div className='mx-auto w-full mt-25 max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>{currentPlant?.name} {currentPlant?.grade}</h1>
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
                      <Table.Column isRowHeader className="min-w-40">Дата</Table.Column>
                      <Table.Column className="w-auto text-center">Тег</Table.Column>
                      <Table.Column className="w-full"></Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {tasks.map((task) => (
                        <Table.Row key={task.id} id={task.id}>
                          <Table.Cell
                            className={cn('w-auto', task.is_overdue ? 'text-red-700' : '')}>{formatDate(task.task_date)}</Table.Cell>
                          <Table.Cell className='w-auto'>
                            <Chip className='text-white w-full flex justify-center items-center'
                                  style={{backgroundColor: TASK_VARIANTS[task.task_tag].color}}>{TASK_VARIANTS[task.task_tag].label}</Chip>
                          </Table.Cell>
                          <Table.Cell className="w-full"/>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4 w-full p-0 relative" id="harvest">
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
                      <AlertDialog.Heading>
                        Внесение урожая
                      </AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <Form className="flex w-full flex-col gap-4 p-2">
                        <TextField className="flex flex-col gap-1">
                          <Label>Дата</Label>
                          <Input
                            type="date"
                            value={harvestDate}
                            onChange={(e) =>
                              setHarvestDate(
                                e.target.value
                              )
                            }
                            className="h-10 border border-gray-300"
                          />
                        </TextField>

                        <TextField className="flex flex-col gap-1">
                          <Label>Значение</Label>
                          <Input
                            type="number"
                            value={harvestValue}
                            onChange={(e) =>
                              setHarvestValue(
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
                        onClick={handleCreateHarvest}
                      >
                        Создать
                      </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          </div>
          <div className='flex w-full mb-5'>
            <Card className='w-full h-full flex justify-center items-center'>
              <BarChart
                className='bg-white'
                style={{width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.5}}
                responsive
                data={chartData}
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
                <Bar dataKey="kg" fill="var(--color-primary)" activeBar={{fill: '#1d5100'}} radius={[0, 0, 0, 0]}/>
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
                    {harvests.map((item) => (
                      <Table.Row key={item.id} id={item.id}>
                        <Table.Cell
                          className={cn('min-w-[140px] text-center')}>{formatDate(item.harvest_date)}</Table.Cell>
                        <Table.Cell
                          className={cn('min-w-[100px] text-center')}>{item.weight} кг</Table.Cell>
                        <Table.Cell className="w-full"/>
                        <Table.Cell className="w-auto">
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
                                      Удаление сбора урожая
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    Вы действительно хотите
                                    удалить эту информацию о собранном урожае?
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close">
                                      Отмена
                                    </Button>
                                    <Button
                                      slot="close"
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={async () => {
                                        await deleteHarvest(
                                          item.id
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
            <Button onClick={handleOpenFilePicker}>
              <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectImage}
              />
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-x-2 gap-y-2 w-fit mx-auto'>
            {currentPlant?.photos?.map((item:PlantPhoto) => (
              <Card
                className='p-0 relative duration-300 hover:scale-102 cursor-pointer rounded-xl shrink-0 w-80 h-80'
                onClick={() => setOpenedPhoto(item)}
              >
                <img
                  src={`http://localhost:8000${item.image_url}`}
                  alt={item.image_url}
                  className='w-full h-full object-cover'
                />
                <div className='absolute right-2 bottom-2 bg-white p-2 pb-0.5 rounded-lg'>
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
                              Удаление фото
                            </AlertDialog.Heading>
                          </AlertDialog.Header>
                          <AlertDialog.Body>
                            Вы действительно хотите удалить фото?
                          </AlertDialog.Body>
                          <AlertDialog.Footer>
                            <Button slot="close">
                              Отмена
                            </Button>
                            <Button
                              slot="close"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={async () => {
                                await deletePlantPhoto(item.id)
                                await getPlantsByPlotId(plotId!)
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
              </Card>
            ))}
          </div>
          <AlertDialog
            isOpen={!!openedPhoto}
            onOpenChange={(open) => {
              if (!open) {
                setOpenedPhoto(null)
              }
            }}
          >
            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog className="p-0 w-[90vw] max-w-6xl">
                  <AlertDialog.CloseTrigger/>
                  <AlertDialog.Body>
                    {openedPhoto && (
                      <img
                        src={`http://localhost:8000${openedPhoto.image_url}`}
                        alt={openedPhoto.image_url}
                        className='w-full max-h-[90vh] object-contain'
                      />
                    )}
                  </AlertDialog.Body>
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};