import { useState } from 'react'
import { BrowserRouter  as Router, Routes, Route} from 'react-router-dom'
import AddEmployee from './AddEmployee'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import EditEmployee from './EditEmployee'
import EmployeeDetails from './EmployeeDetails'
import EmployeeDirectory from './EmployeeDirectory'
import PerformanceGraphs from './PerformanceGraphs'

function App() {
  const [count, setCount] = useState(0)
    return (
      // Wrap the entire app with Router
      <Router>
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<EmployeeDirectory />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path='/EditEmployee' element={<EditEmployee/>}/>
          <Route path='/EmployeeDetails/:id' element={<EmployeeDetails/>}/>
          <Route path='/PerformanceGraphs' element={<PerformanceGraphs/>}/>


        </Routes>
      </Router>
    );
  };

export default App
