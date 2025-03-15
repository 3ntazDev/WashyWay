import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*');
        if (error) throw error;
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-3/4 text-gray-800">
        <h1 className="text-3xl font-semibold mb-4">All Orders</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer Name</th>
              <th className="py-2">Service</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.customer_name}</td>
                <td className="py-2">{order.service}</td>
                <td className="py-2">{order.date}</td>
                <td className="py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;