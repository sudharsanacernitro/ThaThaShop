import { useState,useEffect } from 'react';
import { Search, Filter, Download, ChevronDown, ChevronUp, MoreHorizontal, Eye, Edit, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  
  const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/order/getOrdersByUserId', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        });
        const data = await response.json();
        setOrders(data);
        console.log("Orders data:", data);
        // optionally set state here: setOrders(data)
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
  
    fetchOrders();
  }, []);
  
  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sorted data
  const getSortedData = () => {
    let filteredData = [...orders];
    
    // Apply filters
    if (selectedFilter !== 'All') {
      filteredData = filteredData.filter(order => order.status === selectedFilter);
    }
    
    // Apply sorting
    filteredData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return filteredData;
  };
  
  const sortedData = getSortedData();
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
const displayProduct = async (order) => {
  const orderId = order._id;
  const status = order.status;

  try {
    const response = await fetch("http://localhost:5000/order/displayOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ orderId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Server error: ${response.statusText}`);
    }

    const orderedProduct = await response.json(); 
    orderedProduct.id = orderId;
    orderedProduct.status = status;
    orderedProduct.quantity = order.quantity;
    orderedProduct.customerId=order.userId;
    orderedProduct.email=order.userEmail;
    orderedProduct.contact=order.userContact;
    console.log("Fetched product:", orderedProduct);
    setSelectedProduct(orderedProduct);
    setShowPopup(true);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
};

const updateOrder = async()=>{

    try{  

      console.log("Selected product before update:", selectedProduct._id);

      selectedProduct.status = shipmentStatus;
      selectedProduct.deliveryDate = deliveryDate;

      const response = await fetch("http://localhost:5000/order/updateOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(selectedProduct)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server error: ${response.statusText}`);
      }

      const updatedOrder = await response.json(); 
      console.log("Updated order:", updatedOrder);
      setShowPopup(false);
    }
    catch(err)
    {
      console.error("Error updating order:", err);
    }
}


const [shipmentStatus, setShipmentStatus] = useState('pending');
const [deliveryDate, setDeliveryDate] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 relative">

{showPopup && selectedProduct && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
    <div className="bg-gray-700 rounded-lg shadow-xl p-6 max-w-sm w-full text-white border border-gray-600">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-100">{selectedProduct.name}</h2>
        <button
          onClick={() => setShowPopup(false)}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col items-center mb-4">
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="w-36 h-36 object-cover rounded-md border border-gray-500 mb-4"
        />
      </div>

      <p>{selectedProduct.customerId}</p>
      
      <div className="space-y-2 text-gray-300">
        <p className="flex justify-between">
          <span className="font-medium">Price:</span>
          <span className="text-green-400 font-semibold">${selectedProduct.price} X {selectedProduct.quantity}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Category:</span>
          <span>{selectedProduct.category}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Available:</span>
          <span className={selectedProduct.available ? "text-green-400" : "text-red-400"}>
            {selectedProduct.available ? "Yes" : "No"}
          </span>
        </p>
      </div>

      <div className="mt-6 border-t border-gray-600 pt-4">
        <h3 className="text-lg font-medium text-gray-200 mb-3">Order Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="shipmentStatus" className="block text-sm font-medium text-gray-300 mb-1">
              Shipment Status
            </label>
          <select 
              id="shipmentStatus" 
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shipmentStatus}
              onChange={(e) => setShipmentStatus(e.target.value)}
                >
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="delivered">Delivered</option>
            </select>

          </div>
          
          <div>
            <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-300 mb-1">
              Delivery Date
            </label>
            <input 
                type="date" 
                id="deliveryDate" 
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />

          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setShowPopup(false)}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-700"
        >
          Cancel
        </button>
        
       <button
  onClick={() => updateOrder()}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-700"
>
  Save Changes
</button>

      </div>
    </div>
  </div>
)}
      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 shadow z-20">
        <div className="flex items-center justify-between z-20">
          <h1 className="text-2xl font-bold z-20">Orders Dashboard</h1>
          <div className="flex space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.5 1.5a.5.5 0 01-.7 0L15 17zm0 0h-5l1.5 1.5a.5.5 0 00.7 0L15 17z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v14M9 6l3-3 3 3M9 18l3 3 3-3" />
              </svg>
            </button>
            <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V2a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>
            <div className="bg-gray-700 h-8 w-8 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 z-30">
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden z-20">
          {/* Filters and Search */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-wrap gap-4 z-20">
            <div className="flex space-x-2 z-20">
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors z-20${selectedFilter === 'All' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedFilter('All')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedFilter === 'pending' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedFilter('Pending')}
              >
                Pending
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedFilter === 'Processing' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedFilter('Processing')}
              >
                Processing
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedFilter === 'Completed' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedFilter('Completed')}
              >
                Completed
              </button>
            </div>
            
            <div className="flex space-x-3 z-20">
              <div className="relative z-20">
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="pl-9 pr-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <button className="flex items-center px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-sm z-20">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              
              <button className="flex items-center px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-sm z-20">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto relative z-20">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750 z-20">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider relative z-20">
                    <div className="flex items-center cursor-pointer relative z-20" onClick={() => requestSort('id')}>
                      Order ID
                      {sortConfig.key === '_id' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      ) : null}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider z-20">
                    <div className="flex items-center cursor-pointer " onClick={() => requestSort('customer')}>
                      Contact
                      {sortConfig.key === 'contact' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      ) : null}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('date')}>
                      Date
                      {sortConfig.key === 'orderDate' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      ) : null}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('status')}>
                      Status
                      {sortConfig.key === 'status' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      ) : null}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('total')}>
                      Total
                      {sortConfig.key === 'totalAmount' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      ) : null}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('items')}>
                      Items
                      {sortConfig.key === 'orderCount' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      ) : null}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700 z-20">
                {currentItems.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm z-20">
                      {order.userEmail+" "+order.userContact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.orderDate.split('T')[0]} {order.orderDate.split('T')[1].split('.')[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)} z-20`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(order.price*order.quantity).toFixed(2)} $
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        
                        <button className="p-1 rounded-md hover:bg-gray-700 transition-colors" onClick={() => displayProduct(order)}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded-md hover:bg-gray-700 transition-colors">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between sm:px-6">
            <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                    {Math.min(indexOfLastItem, sortedData.length)}
                  </span> of <span className="font-medium">{sortedData.length}</span> results
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`relative inline-flex items-center px-4 py-2 border ${currentPage === number
                        ? 'bg-gray-700 border-gray-700 text-white' 
                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
                      } text-sm font-medium`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}