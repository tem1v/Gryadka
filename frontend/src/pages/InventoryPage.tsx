import {Button} from "@/components/ui/Button.tsx";
import {LucidePlus, LucideSquarePen, LucideTrash2} from "lucide-react";
import {
  Tabs,
  Table,
  type Selection,
  AlertDialog,
  Form,
  TextField,
  Label,
  Input,
  ComboBox, ListBox
} from '@heroui/react';
import {useEffect, useState} from "react";
import {useInventoryStore} from "@/store/inventory.store.ts";
import {INVENTORY_ITEM_TYPES} from "@/constants/inventoryTypes.ts";
import {useAuthStore} from "@/store/auth.store.ts";
import type {InventoryItem} from "@/types/inventory.types.ts";

interface Props {

};


export function InventoryPage(props: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [itemName, setItemName] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<string>('');
  const [itemType, setItemType] = useState<string>("");

  const [editItemName, setEditItemName] = useState<string>(itemName);
  const [editItemQuantity, setEditItemQuantity] = useState<string>(itemQuantity);
  const [editItemType, setEditItemType] = useState<string>(itemType);
  const selectedLocation = useAuthStore((state) => state.selectedLocation)

  const items = useInventoryStore(
    (state) => state.items
  )

  const getInventory =
    useInventoryStore(
      (state) => state.getInventory
    )
  const createInventoryItem = useInventoryStore((state) => state.createInventoryItem)
  const updateInventoryItem = useInventoryStore((state) => state.updateInventoryItem)
  const deleteInventoryItem = useInventoryStore((state) => state.deleteInventoryItem)

  useEffect(() => {

    getInventory()

  }, [])

  const handleCreateInventoryItem = async () => {
    await createInventoryItem({
      name:itemName,
      item_type:itemType,
      quantity: Number(itemQuantity),
      location: selectedLocation
    })
    clearForm()
  }
  const handleUpdateInventoryItem = async (itemId:string) => {
    await updateInventoryItem({
      id: itemId,
      name:editItemName,
      item_type:editItemType,
      quantity: Number(editItemQuantity),
      location:selectedLocation
    })
  }
  const handleDeleteInventoryItem = async (itemId:string) => {
    await deleteInventoryItem(itemId)
  }
  const clearForm = async () => {
    setItemName('');
    setItemQuantity('');
    setItemType('');
  }
  const openEditModal = (tool: InventoryItem) => {

    setEditItemName(tool.name)

    setEditItemQuantity(String(tool.quantity))

    setEditItemType(tool.item_type)

  }
  return (
    <div className='mx-auto mt-25 w-full max-w-[1480px]'>
      <div className='flex items-center justify-between mb-15'>
        <h1>Инвентарь</h1>
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
                  <AlertDialog.Heading>Добавление в инвентарь</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <Form className="flex w-full flex-col gap-4 p-2">
                    <ComboBox
                      className="w-full"
                      selectedKey={itemType}
                      onSelectionChange={(key) => setItemType(key)}
                    >
                      <Label>Тип</Label>
                      <ComboBox.InputGroup>
                        <Input
                          placeholder="Выберите тип"
                          className="h-10 border border-gray-300"
                          value={
                            itemType ? INVENTORY_ITEM_TYPES[itemType]?.label : ''
                          }
                          onChange={(e) => setItemType(e.target.value)}
                        />
                        <ComboBox.Trigger />
                      </ComboBox.InputGroup>
                      <ComboBox.Popover>
                        <ListBox>
                          {Object.entries(INVENTORY_ITEM_TYPES).map(
                            ([typeKey, type]) => (
                              <ListBox.Item
                                key={typeKey}
                                id={typeKey}
                                textValue={type.label}
                              >
                                {type.label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            )
                          )}
                        </ListBox>
                      </ComboBox.Popover>
                    </ComboBox>
                    <TextField className="flex flex-col gap-1">
                      <Label htmlFor="input-type-text">Название</Label>
                      <Input id="input-type-text" placeholder="Название" type="text"
                             value={itemName}
                             onChange={(e) => setItemName(e.target.value)}
                             className='h-10 border border-gray-300'/>
                    </TextField>
                    <TextField className="flex flex-col gap-1">
                      <Label htmlFor="input-type-text">Количество</Label>
                      <Input id="input-type-text" placeholder="0" type="number"
                             value={itemQuantity ?? ''}
                             onChange={(e) => setItemQuantity(e.target.value)}
                             className='h-10 border border-gray-300'/>
                    </TextField>
                  </Form>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" onClick={clearForm}>
                    Отмена
                  </Button>
                  <Button slot="close" onClick={handleCreateInventoryItem}>
                    Создать
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
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
                  {items.filter((t) => (t.item_type === "tool" && t.location === selectedLocation)).map((tool) => (
                    <Table.Row key={tool.id} id={tool.id}>
                      <Table.Cell>{tool.name}</Table.Cell>
                      <Table.Cell className='text-center'>
                        {tool.quantity}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-3.5">
                          <AlertDialog>
                            <AlertDialog.Trigger>
                              <button className="cursor-pointer transition-all duration-300 hover:opacity-60" onClick={() => openEditModal(tool)}>
                                <LucideSquarePen />
                              </button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Heading>
                                      Редактирование инвентаря
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <Form className="flex w-full flex-col gap-4 p-2">
                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Название</Label>
                                        <Input id="input-type-text" placeholder="Название" type="text"
                                               value={editItemName}
                                               onChange={(e) => setEditItemName(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Количество</Label>
                                        <Input id="input-type-text" placeholder="0" type="number"
                                               value={editItemQuantity ?? ''}
                                               onChange={(e) => setEditItemQuantity(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                    </Form>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close" onClick={clearForm}>
                                      Отмена
                                    </Button>
                                    <Button
                                      slot="close"
                                      onClick={()=>handleUpdateInventoryItem(tool.id)}
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
                                      Удаление из инвентаря
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <p>
                                      Вы уверены, что хотите удалить
                                      <span className="font-semibold">
                                      {" "}
                                        {tool.name}
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
                                      onClick={() => handleDeleteInventoryItem(tool.id)}
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
                  <Table.Column isRowHeader className="w-full">Название</Table.Column>
                  <Table.Column className="w-fit max-w-40 text-center">Количество(упак.)</Table.Column>
                  <Table.Column className="w-auto"/>
                </Table.Header>
                <Table.Body>
                  {items.filter((s) => (s.item_type === "seeds" && s.location === selectedLocation)).map((seed) => (
                    <Table.Row key={seed.id} id={seed.id}>
                      <Table.Cell>{seed.name}</Table.Cell>
                      <Table.Cell className='text-center'>
                        {seed.quantity}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-3.5">
                          <AlertDialog>
                            <AlertDialog.Trigger>
                              <button className="cursor-pointer transition-all duration-300 hover:opacity-60" onClick={() => openEditModal(seed)}>
                                <LucideSquarePen />
                              </button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Heading>
                                      Редактирование инвентаря
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <Form className="flex w-full flex-col gap-4 p-2">

                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Название</Label>
                                        <Input id="input-type-text" placeholder="Название" type="text"
                                               value={editItemName}
                                               onChange={(e) => setEditItemName(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Количество</Label>
                                        <Input id="input-type-text" placeholder="0" type="number"
                                               value={editItemQuantity ?? ''}
                                               onChange={(e) => setEditItemQuantity(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                    </Form>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close" onClick={clearForm}>
                                      Отмена
                                    </Button>
                                    <Button
                                      slot="close"
                                      onClick={()=>handleUpdateInventoryItem(seed.id)}
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
                                      Удаление из инвентаря
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <p>
                                      Вы уверены, что хотите удалить
                                      <span className="font-semibold">
                                      {" "}
                                        {seed.name}
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
                                      onClick={() => handleDeleteInventoryItem(seed.id)}
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
                  <Table.Column isRowHeader className="w-full">Название</Table.Column>
                  <Table.Column className="w-fit min-w-40 text-center">Количество</Table.Column>
                  <Table.Column className="w-auto"/>
                </Table.Header>
                <Table.Body>
                  {items.filter((f) => (f.item_type === "fertilizer" && f.location === selectedLocation)).map((fertilizer) => (
                    <Table.Row key={fertilizer.id} id={fertilizer.id}>
                      <Table.Cell>{fertilizer.name}</Table.Cell>
                      <Table.Cell className='text-center'>
                        {fertilizer.quantity}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-3.5">
                          <AlertDialog>
                            <AlertDialog.Trigger>
                              <button className="cursor-pointer transition-all duration-300 hover:opacity-60" onClick={() => openEditModal(fertilizer)}>
                                <LucideSquarePen />
                              </button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Heading>
                                      Редактирование инвентаря
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <Form className="flex w-full flex-col gap-4 p-2">

                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Название</Label>
                                        <Input id="input-type-text" placeholder="Название" type="text"
                                               value={editItemName}
                                               onChange={(e) => setEditItemName(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                      <TextField className="flex flex-col gap-1">
                                        <Label htmlFor="input-type-text">Количество</Label>
                                        <Input id="input-type-text" placeholder="0" type="number"
                                               value={editItemQuantity ?? ''}
                                               onChange={(e) => setEditItemQuantity(e.target.value)}
                                               className='h-10 border border-gray-300'/>
                                      </TextField>
                                    </Form>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close" onClick={clearForm}>
                                      Отмена
                                    </Button>
                                    <Button
                                      slot="close"
                                      onClick={()=>handleUpdateInventoryItem(fertilizer.id)}
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
                                      Удаление из инвентаря
                                    </AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <p>
                                      Вы уверены, что хотите удалить
                                      <span className="font-semibold">
                                      {" "}
                                        {fertilizer.name}
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
                                      onClick={() => handleDeleteInventoryItem(fertilizer.id)}
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
      </Tabs>
    </div>
  );
};