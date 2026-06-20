import './App.css'
import {PlotsPage} from "@/pages/PlotsPage.tsx";
import {Routes, Route} from "react-router-dom";
import {InventoryPage} from "@/pages/InventoryPage.tsx";
import {TasksPage} from "@/pages/TasksPage.tsx";
import {PlotPage} from "@/pages/PlotPage.tsx";
import {PlantPage} from "@/pages/PlantPage.tsx";
import {AuthPage} from "@/pages/AuthPage.tsx";
import {Layout} from "@/components/layout/Layout.tsx";
import {AIPage} from "@/pages/AIPage.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<AuthPage/>}/>
        <Route element={<Layout/>}>
          <Route path="/plots" element={<PlotsPage/>}/>
          <Route path="/plots/:id" element={<PlotPage/>}/>
          <Route path="/plots/:plotId/plant/:plantId" element={<PlantPage/>}/>
          <Route path="/tasks" element={<TasksPage/>}/>
          <Route path="/inventory" element={<InventoryPage/>}/>
          <Route path="/ai" element={<AIPage/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
