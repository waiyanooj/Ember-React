import axios from "axios";

const menuData = () =>{
  const handleMenu = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/user/productList")
  }
}
  

export default menuData;