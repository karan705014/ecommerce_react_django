import ProductList from "./pages/ProductList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails.jsx";
import NavBar from "./components/NavBar.jsx";
import CartPage from "./pages/CartPage.jsx";
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}
export default App;