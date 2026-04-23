import './App.css'
import {PlotsPage} from "@/pages/PlotsPage.tsx";
import {Routes, Route} from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/plots" element={<PlotsPage/>}/>
        <Route path="/weather" element={<PlotsPage/>}/>
        <Route path="/tasks" element={<PlotsPage/>}/>
        <Route path="/inventory" element={<PlotsPage/>}/>
      </Routes>
    </>
  )
}

export default App
