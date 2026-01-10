import ProductList from "../pages/ProductList";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import ProductDetails from "../pages/ProductDetails.jsx";
function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<ProductList/>}/>
        <Route path="/products/:id" element={<ProductDetails/>}/>
      </Routes>
    </Router>
  );
}
export default App;