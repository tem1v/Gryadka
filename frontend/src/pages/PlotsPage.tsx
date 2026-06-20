import {Button} from "@/components/ui/Button.tsx";
import {AlertDialog, ComboBox, Form, Input, Label, ListBox, TextField} from "@heroui/react";
import {LucideArrowLeft, LucideCheck, LucidePlus} from "lucide-react";
import type {Plot} from "@/types/plot.types.ts";
import {PlotCard} from "@/components/features/Plot/PlotCard.tsx";
import {useAuthStore} from "@/store/auth.store.ts";
import {formatDate} from "@/utils/formatDate.ts";
import {type Key, useEffect, useState} from "react";
import {usePlotsStore} from "@/store/plots.store.ts";


interface Props {

};


export function PlotsPage(props: Props) {
  const getPlots = usePlotsStore(
    (state) => state.getPlots
  )

  const plots = usePlotsStore(
    (state) => state.plots
  )
  useEffect(() => {
    getPlots()
  }, [])
  const selectedLocation = useAuthStore((state) => state.selectedLocation)
  const filteredPlots = plots.filter(
    (plot) => plot.location === selectedLocation
  )
  const [plotName, setPlotName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [location, setLocation] = useState("");
  const createPlot = usePlotsStore((state) => state.createPlot)

  const handleCreatePlot = async () => {

    if (!plotName || !location) return

    await createPlot({
      name: plotName,
      type: "greenhouse",
      location: location,
      image: imageFile
    })

    setPlotName("")
    setLocation("")
    setImageFile(null)
  }

  return (
    <div className='mx-auto mt-25 max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>Участки</h1>
        <AlertDialog>
          <AlertDialog.Trigger>
            <Button>
              <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="sm:max-w-[400px]">
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Heading>Создание участка</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <Form className="flex w-full flex-col gap-4 p-2">
                    <TextField className="flex flex-col gap-1">
                      <Label htmlFor="input-type-text">Название</Label>
                      <Input id="input-type-text" placeholder="Участок" type="text"
                             value={plotName}
                             onChange={(e) => setPlotName(e.target.value)}
                             className='h-10 border border-gray-300'/>
                    </TextField>
                    <TextField className="flex flex-col gap-1">
                      <Label htmlFor="input-type-text">Населенный пункт</Label>
                      <Input id="input-type-text" placeholder="Агаповка" type="text"
                             value={location}
                             onChange={(e) => setLocation(e.target.value)}
                             className='h-10 border border-gray-300'/>
                    </TextField>

                    <div className='relative'>
                      <Label htmlFor="add-plot-image">Изображение</Label>
                      <Input
                        className='w-full h-10 border border-gray-300'
                        type='file'
                        id='add-plot-image'
                        accept="image/*"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] ?? null)
                        }
                      />
                    </div>
                  </Form>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close">
                    Отмена
                  </Button>
                  <Button slot="close" onClick={handleCreatePlot}>
                    Создать
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </div>
      <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {filteredPlots.map((plot) => (
          <PlotCard key={plot.id} id={plot.id} title={plot.name} createdAt={formatDate(plot.created_at)} photo={plot.image_url} location={plot.location} />
        ))}
      </div>
    </div>
  );
};