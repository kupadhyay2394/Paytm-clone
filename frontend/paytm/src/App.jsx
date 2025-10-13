import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Signup } from "./Pages/Signup.jsx";
import { Signin } from "./Pages/Signin.jsx";
import { Dashboard } from "./Pages/Dashboard.jsx";
import { SendMoney } from "./Pages/SendMoney.jsx";
import { AddMoneyPage } from "./Pages/AddMoney.jsx";
import { CreateAccountPage } from "./Pages/CreateAccount.jsx";
import { TransactionHistory } from "./Pages/TransactionHistory.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/add-money" element={<AddMoneyPage />} />
              <Route path="/create-account" element={<CreateAccountPage />} /> 
          <Route path="/send" element={<SendMoney />} />
          <Route path="/history" element={<TransactionHistory />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;

