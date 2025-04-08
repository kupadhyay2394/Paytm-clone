import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup></Signup>}></Route>
      {/* <Route path="" element={}></Route>
      <Route path="" element={}></Route>
      <Route path="" element={}></Route> */}
    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
