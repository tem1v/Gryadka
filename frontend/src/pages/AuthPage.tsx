import {Card, Input, Label, Tabs, TextField, Form, ComboBox, ListBox, Button as BaseButton} from "@heroui/react";
import icon from "/icon.svg";
import {Button} from "@/components/ui/Button.tsx";
import {EyeClosedIcon, EyeIcon, LucideArrowLeft, LucideArrowRight, LucideCheck, LucideLogIn} from "lucide-react";
import {useRef, useState} from "react";

interface Props {

};

export function AuthPage(props: Props) {
  const [passwordVisibility, setPasswordVisibility] = useState({
    auth:false,
    first:false,
    second:false
  });

  const togglePasswordVisibility = (type: "auth" | "first" | "second") => {
    setPasswordVisibility(prev => ({
      ...prev,
      [type]: !prev[type],
    }))
  };
  const [step, setStep] = useState(0);

  return (
    <div className='w-full h-screen flex justify-center items-center overflow-hidden'>
        <div className='w-100 overflow-hidden'>
          <div
            className='flex gap-100 items-center mb-1 transition-transform duration-1000 ease-in-out '
            style={{ transform: `translateX(-${step * 800}px)` }}
          >
            <Card className="w-100 h-fit p-0 shrink-0">
            <div className='border-b-1 flex flex-col items-center justify-center px-25 py-4.5 text-center'>
              <img src={icon} alt="Logo" className='h-14 w-14'/>
              <h1 className='text-black font-normal text-2xl m-0'>Грядка</h1>
              <span
                className='font-normal text-black/70 tracking-wide leading-4 text-sm'>Цифровой помощник для садоводов</span>
            </div>
            <Tabs className="w-full flex items-center justify-center" defaultSelectedKey='auth'>
              <Tabs.ListContainer className='w-fit'>
                <Tabs.List aria-label="Plot" className="">
                  <Tabs.Tab id="auth" className="data-[selected=true]:text-white">
                    Авторизация
                    <Tabs.Indicator className='bg-primary'/>
                  </Tabs.Tab>
                  <Tabs.Tab id="registration" className="data-[selected=true]:text-white">
                    Регистрация
                    <Tabs.Indicator className='bg-primary'/>
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel className="w-full" id="auth">
                <Form className="flex w-full flex-col gap-4">
                  <TextField className="flex flex-col gap-1">
                    <Label htmlFor="input-type-email">Эл. почта</Label>
                    <Input id="input-type-email" placeholder="email@example.com" type="email"
                           className='h-10 border border-gray-300'/>
                  </TextField>
                  <TextField className="flex flex-col gap-1 relative">
                    <Label htmlFor="input-type-password">Пароль</Label>
                    <Input id="input-type-password" placeholder={passwordVisibility.auth ? "Пароль" : "••••••••"}
                           type={passwordVisibility.auth ? "text" : "password"}
                           className='h-10 border border-gray-300'/>
                    <button className='absolute top-9 right-4 cursor-pointer'
                            onClick={() => togglePasswordVisibility("auth")} type="button">
                      {passwordVisibility.auth ?
                        (<EyeIcon className="h-5 w-5 text-gray-400 duration-300 hover:text-gray-700"/>) :
                        (<EyeClosedIcon className="h-5 w-5 text-gray-400 duration-300 hover:text-gray-700"/>)
                      }
                    </button>
                  </TextField>
                  <span className="text-sm text-center text-muted duration-300 w-full cursor-pointer hover:text-black">Забыли пароль?</span>
                  <Button className="w-full mb-3" type="submit">
                    <LucideLogIn/>
                    Войти
                  </Button>
                </Form>
              </Tabs.Panel>
              <Tabs.Panel className="" id="registration">
                <Form className="flex w-full flex-col gap-4">
                  <TextField className="flex flex-col gap-1">
                    <Label htmlFor="input-type-text">Как к вам обращаться?</Label>
                    <Input id="input-type-text" placeholder="Ваше имя" type="text"
                           className='h-10 border border-gray-300'/>
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label htmlFor="input-type-email">Эл. почта</Label>
                    <Input id="input-type-email" placeholder="email@example.com" type="email"
                           className='h-10 border border-gray-300'/>
                  </TextField>
                  <TextField className="flex flex-col gap-1 relative">
                    <Label htmlFor="input-type-password">Пароль</Label>
                    <Input id="input-type-password" placeholder={passwordVisibility.first ? "Пароль" : "••••••••"}
                           type={passwordVisibility.first ? "text" : "password"}
                           className='h-10 border border-gray-300'/>
                    <button className='absolute top-9 right-4 cursor-pointer'
                            onClick={() => togglePasswordVisibility("first")} type="button">
                      {passwordVisibility.first ?
                        (<EyeIcon className="h-5 w-5 text-gray-400 duration-300 hover:text-gray-700"/>) :
                        (<EyeClosedIcon className="h-5 w-5 text-gray-400 duration-300 hover:text-gray-700"/>)
                      }
                    </button>
                  </TextField>
                  <TextField className="flex flex-col gap-1 relative">
                    <Label htmlFor="repeat-password">Повторите пароль</Label>
                    <Input id="repeat-password" placeholder={passwordVisibility.second ? "Пароль" : "••••••••"}
                           type={passwordVisibility.second ? "text" : "password"}
                           className='h-10 border border-gray-300'/>
                    <button className='absolute top-9 right-4 cursor-pointer'
                            onClick={() => togglePasswordVisibility("second")} type="button">
                      {passwordVisibility.second ?
                        (<EyeIcon className="h-5 w-5 text-gray-400 duration-300 hover:text-gray-700"/>) :
                        (<EyeClosedIcon className="h-5 w-5 text-gray-400 duration-300 hover:text-gray-700"/>)
                      }
                    </button>
                  </TextField>
                  <Button className="w-full mb-3" type="button" onClick={() => setStep(1)}>
                    <LucideArrowRight/>
                    Далее
                  </Button>
                </Form>
              </Tabs.Panel>
            </Tabs>
          </Card>
            <Card className="w-100 h-fit p-0 shrink-0">
              <div className='border-b-1 flex flex-col items-center justify-center px-25 py-4.5 text-center'>
                <img src={icon} alt="Logo" className='h-14 w-14'/>
                <h1 className='text-black font-normal text-2xl m-0'>Грядка</h1>
                <span
                  className='font-normal text-black/70 tracking-wide leading-4 text-sm'>Цифровой помощник для садоводов</span>
              </div>
              <Form className="flex w-full flex-col gap-4 p-2">
                <h1 className='text-black text-2xl'>Создайте ваш первый участок</h1>
                <TextField className="flex flex-col gap-1">
                  <Label htmlFor="input-type-text">Название</Label>
                  <Input id="input-type-text" placeholder="Участок" type="text"
                         className='h-10 border border-gray-300'/>
                </TextField>
                <ComboBox className="w-full">
                  <Label>Населенный пункт</Label>
                  <ComboBox.InputGroup>
                    <Input placeholder="Казань" className='h-10 border border-gray-300'/>
                    <ComboBox.Trigger/>
                  </ComboBox.InputGroup>
                  <ComboBox.Popover>
                    <ListBox>
                      <ListBox.Item id="aardvark" textValue="Aardvark">
                        Aardvark
                        <ListBox.ItemIndicator/>
                      </ListBox.Item>
                      <ListBox.Item id="cat" textValue="Cat">
                        Cat
                        <ListBox.ItemIndicator/>
                      </ListBox.Item>
                      <ListBox.Item id="dog" textValue="Dog">
                        Dog
                        <ListBox.ItemIndicator/>
                      </ListBox.Item>
                      <ListBox.Item id="kangaroo" textValue="Kangaroo">
                        Kangaroo
                        <ListBox.ItemIndicator/>
                      </ListBox.Item>
                      <ListBox.Item id="panda" textValue="Panda">
                        Panda
                        <ListBox.ItemIndicator/>
                      </ListBox.Item>
                      <ListBox.Item id="snake" textValue="Snake">
                        Snake
                        <ListBox.ItemIndicator/>
                      </ListBox.Item>
                    </ListBox>
                  </ComboBox.Popover>
                </ComboBox>
                <div className='relative'>
                  <Label htmlFor="add-plot-image">Изображение</Label>
                  <Input
                    className='w-full h-10 border border-gray-300'
                    type='file'
                    id='add-plot-image'
                    accept="image/*"
                    onChange={(e) => console.log(e.target.files[0])}
                  />
                </div>
                <Button className="w-full" type="button" onClick={() => setStep(0)}>
                  <LucideArrowLeft/>
                  Назад
                </Button>
                <Button className="w-full mb-3" type="button">
                  <LucideCheck/>
                  Завершить регистрацию
                </Button>
              </Form>
            </Card>
          </div>
        </div>
    </div>
  );
};