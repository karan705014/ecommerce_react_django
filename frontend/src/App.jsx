import ProductList from "./pages/ProductList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails.jsx";
import NavBar from "./components/NavBar.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheackoutPage from "./pages/CheackoutPage.jsx";
import PrivateRouter from "./components/PrivateRouter.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route element={<PrivateRouter />}>
          <Route path="/checkout" element={<CheackoutPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  );
}
export default App;