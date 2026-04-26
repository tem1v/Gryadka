import './App.css'
import {PlotsPage} from "@/pages/PlotsPage.tsx";
import {Routes, Route} from "react-router-dom";
import {WeatherPage} from "@/pages/WeatherPage.tsx";
import {InventoryPage} from "@/pages/InventoryPage.tsx";
import {TasksPage} from "@/pages/TasksPage.tsx";

function App() {

  return (
    <>
      <Routes>
        <Route path="/plots" element={<PlotsPage/>}/>
        <Route path="/weather" element={<WeatherPage/>}/>
        <Route path="/tasks" element={<TasksPage/>}/>
        <Route path="/inventory" element={<InventoryPage/>}/>
      </Routes>
    </>
  )
}

export default App
