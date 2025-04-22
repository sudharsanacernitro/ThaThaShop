import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { styles } from '../styles';

function SubProduct() {
  const location = useLocation();
  const { category } = location.state || {};
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (category) {
      fetch(`http://localhost:5000/api/category/${category}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          return response.json();
        })
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error fetching products:', error));
    }
  }, [category]);

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
                src={`http://localhost:5000/images/${category}/${product.image}`}
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
                  $ {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-gray-600 rounded-2xl p-8 w-[50%]  relative'>
            <button
              onClick={() => setSelectedProduct(null)}
              className='absolute top-2 right-2 text-xl font-bold text-red-600'
            >
              &times;
            </button>
            <img
              src={`http://localhost:5000/images/${category}/${selectedProduct.image}`}
              alt={selectedProduct.name}
              className='size-[500px] object-cover rounded-xl mb-4 '
            />
            <h2 className='text-3xl font-bold mb-2 uppercase'>
              {selectedProduct.name}
            </h2>
            <p className='text-xl text-gray-800 mb-2'>
              Price: ${selectedProduct.price}
            </p>
            <p className='text-md text-gray-600'>
              {/* You can add more detailed product info here */}
              Description goes here...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubProduct;
