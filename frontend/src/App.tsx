import './App.css'
import {PlotsPage} from "@/pages/PlotsPage.tsx";
import {Routes, Route} from "react-router-dom";
import {WeatherPage} from "@/pages/WeatherPage.tsx";
import {InventoryPage} from "@/pages/InventoryPage.tsx";

function App() {

  return (
    <>
      <Routes>
        <Route path="/plots" element={<PlotsPage/>}/>
        <Route path="/weather" element={<WeatherPage/>}/>
        <Route path="/tasks" element={<PlotsPage/>}/>
        <Route path="/inventory" element={<InventoryPage/>}/>
      </Routes>
    </>
  )
}

export default App
