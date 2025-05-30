import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

function SubProduct() {

  const navigate = useNavigate();
  const location = useLocation();
  const { category } = location.state || {};
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
    const ip=import.meta.env.VITE_API_URL;
useEffect(() => {
  if (category) {
    const token = localStorage.getItem('jwtToken'); // assuming the JWT is stored in localStorage

    fetch(`${ip}/product/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 'categoryName': category }) // Send category in body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        else if (response.status === 401) {
          // console.error('Unauthorized');
          // window.alert("Unauthorized");
          navigate('/login');
          return;
        }
        return response.json();
      })
      .then((data) => {
            console.log(data); // ✅ Already done
            if (Array.isArray(data.data)) {
              setProducts(data.data); // ✅ Use the correct path to array
            } else {
              console.error('Expected product array at data.data, got:', data);
            }
          })
      .catch((error) => console.error('Error fetching products:', error));
  }
}, [category]);


const [itemCount, setItemCount] = useState(10); 

const incrementCount = () => setItemCount((prev) => prev + 10);
const decrementCount = () => setItemCount((prev) => (prev > 10 ? prev - 10 : 10));

 async function addToCart(productId,price)
  {
    fetch(`${ip}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 'productId': productId , 'quantity' : itemCount ,'price':price}) // Send category in body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        else if (response.status === 401) {
          // console.error('Unauthorized');
          // window.alert("Unauthorized");
          navigate('/login');
          return;
        }
        
        window.alert("Added to cart");
      })
      .catch((error) => console.error('Error fetching products:', error));
  }

  return (
    <div className='z-20 relative'>
      <Navbar />
      <div className='w-full flex justify-center items-center'>
        <div className='w-[95%] border-4 border-white-100 flex flex-wrap gap-5 p-5 cursor-pointer'>
          {products.map((product, index) => (
            <div
              key={index}
              className='card w-80px h-300px p-4 flex flex-col gap-2 rounded-2xl'
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={`${product.image}`}
                alt={product.name}
                className='size-96 rounded-2xl'
              />
              <div className='bg-gray-600 p-5 rounded-2xl'>
                <div className='flex w-full justify-between '>
                  <h1 className='font-[700] text-[50px] uppercase'>
                    {product.name.split(" ")[0]}
                  </h1>
                  <div className='w-[10px] h-[10px] rounded-2xl bg-green-600 animate-blink'></div>
                </div>
                <p className='font-[500] text-[25px] text-amber-400'>
                  ₹ {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
       <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
       <div className='bg-gray-800 rounded-2xl p-8 w-[50%] relative flex'>
         <button
           onClick={() => setSelectedProduct(null)}
           className='absolute top-2 right-2 text-xl font-bold text-red-600'
         >
           &times;
         </button>
     
         <img
           src={`${selectedProduct.image}`}
           alt={selectedProduct.name}
           className='size-[500px] object-cover rounded-xl mb-4'
         />
     
         <div className='flex flex-col justify-start items-center w-[50%]'>
           <div className='flex justify-center items-center flex-col w-full'>
             <h1 className='font-[1000] text-[100px] uppercase text-yellow-300'>10%</h1>
             <h1 className='font-[700] text-[20px] uppercase'>Discount on bulk order</h1>
           </div>
     
           <div className='mt-10 flex justify-start items-center flex-col w-full'>
             <h2 className='text-7xl font-bold mb-2 uppercase'>{selectedProduct.name}</h2>
             <p className='text-xl text-white mb-2'>Price: ₹{selectedProduct.price}</p>
             <p className='text-md text-gray-600'>Description goes here...</p>
     
             {/* Quantity Selector */}
             <div className='flex items-center gap-4 mt-6'>
               <button
                 onClick={decrementCount}
                 className='bg-red-500 text-white px-3 py-1 rounded-lg text-xl'
               >
                 −
               </button>
               <span className='text-white text-xl'>{itemCount}</span>
               <button
                 onClick={incrementCount}
                 className='bg-green-500 text-white px-3 py-1 rounded-lg text-xl'
               >
                 +
               </button>
             </div>
     
             <div className='flex justify-around mt-6 w-full'>
               <button className='bg-blue-500 text-white px-4 py-2 rounded-lg' onClick={async() => await addToCart(selectedProduct._id,selectedProduct.price)}>
                 Add to Cart
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
     
      )}
    </div>
  );
}

export default SubProduct;
