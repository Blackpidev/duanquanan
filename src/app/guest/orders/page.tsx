import OrdersCard from '@/app/guest/orders/orders-cart'
import React from 'react'

export default function OrdersPage() {
  return (
    <div className='max-w-[400px] mx-auto space-x-4'>
        <h1 className='text-center text-xl font-bold'> Đơn hàng</h1>
        <OrdersCard />
    </div>
  )
}