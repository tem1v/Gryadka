import {
  AlertDialog,
  Card,
  ComboBox,
  Form,
  Input,
  Label,
  ListBox,
  TextField
} from "@heroui/react";

import { LucideSquarePen, LucideTrash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button.tsx";
import { type Key, useState } from "react";
import {usePlotsStore} from "@/store/plots.store.ts";

interface Props {
  id: string;
  title: string;
  createdAt: string;
  photo?: string;
  location: string;
}

export function PlotCard({
                           id,
                           title,
                           createdAt,
                           photo,
                           location
                         }: Props) {
  const updatePlot = usePlotsStore(
    (state) => state.updatePlot
  )

  const deletePlot = usePlotsStore(
    (state) => state.deletePlot
  )


  const [editTitle, setEditTitle] = useState(title);

  const [editLocation, setEditLocation] = useState(location);

  const [imageFile, setImageFile] = useState<File | null>(null);


  const handleSave = async () => {

    await updatePlot({
      id,
      name: editTitle,
      type: "greenhouse",
      location: editLocation,
      image: imageFile
    })
  }

  const handleDelete = async () => {
    await deletePlot(id)
  }

  return (
    <Card className="p-0 max-w-120 max-h-90 relative transition duration-300 hover:scale-101">
      <div className="w-120 h-60 overflow-hidden">
        <Link to={`/plots/${id}`}>
          <img
            src={photo ? `http://localhost:8000${photo}` : "/plot3.avif"}
            alt={title}
            className="w-full object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center justify-between w-full px-5 py-3">
        <Link to={`/plots/${id}`}>
          <div className="flex flex-col items-start justify-between">
            <h3>{title}</h3>
            <span>Создан: {createdAt}</span>
          </div>
        </Link>
        <div className="flex gap-3.5">
          <AlertDialog>
            <AlertDialog.Trigger>
              <button className="cursor-pointer transition-all duration-300 hover:opacity-60">
                <LucideSquarePen />
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog className="sm:max-w-[400px]">
                  <AlertDialog.CloseTrigger />
                  <AlertDialog.Header>
                    <AlertDialog.Heading>
                      Редактирование участка
                    </AlertDialog.Heading>
                  </AlertDialog.Header>
                  <AlertDialog.Body>
                    <Form className="flex w-full flex-col gap-4 p-2">
                      <TextField className="flex flex-col gap-1">
                        <Label htmlFor={`plot-name-${id}`}>
                          Название
                        </Label>
                        <Input
                          id={`plot-name-${id}`}
                          type="text"
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(e.target.value)
                          }
                          className="h-10 border border-gray-300"
                        />
                      </TextField>
                      <TextField className="flex flex-col gap-1">
                        <Label htmlFor="input-type-text">Населенный пункт</Label>
                        <Input id="input-type-text" placeholder="Агаповка" type="text"
                               value={editLocation}
                               onChange={(e) => setEditLocation(e.target.value)}
                               className='h-10 border border-gray-300'/>
                      </TextField>
                      <div className="relative w-full">
                        <Label htmlFor={`plot-image-${id}`}>
                          Изображение
                        </Label>
                        <Input
                          className="w-full h-10 border border-gray-300"
                          type="file"
                          id={`plot-image-${id}`}
                          accept="image/*"
                          onChange={(e) =>
                            setImageFile(
                              e.target.files?.[0] ?? null
                            )
                          }
                        />
                      </div>
                    </Form>
                  </AlertDialog.Body>
                  <AlertDialog.Footer>
                    <Button slot="close">
                      Отмена
                    </Button>
                    <Button
                      slot="close"
                      onClick={handleSave}
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
                      Удаление участка
                    </AlertDialog.Heading>
                  </AlertDialog.Header>
                  <AlertDialog.Body>
                    <p>
                      Вы уверены, что хотите удалить участок
                      <span className="font-semibold">
                        {" "}
                        "{title}"
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
                      onClick={handleDelete}
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

      </div>

    </Card>
  );
}