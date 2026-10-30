"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, FREE_SHIPPING_FROM, SHIPPING_COST } from "@/lib/format";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

    const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  const total = subtotal - discount + shipping;

  function applyCoupon() {
    if (coupon === "CAFE10") {
      setDiscount(10);
    }
  }

  if (items.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-2xl">Tu carrito está vacío</p>
        <Link href="/productos" className="text-amber-700 underline">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-4xl font-bold">Tu carrito</h1>

      <table className="min-w-[700px] text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-3">
                {item.product.emoji} {item.product.name}
              </td>
              <td>{formatPrice(item.product.price)}</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.product.id, Number(e.target.value))
                  }
                  className="w-16 rounded border px-2"
                />
              </td>
              <td>{formatPrice(item.product.price * item.quantity)}</td>
              <td>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 flex justify-between gap-10">
        <div className="flex gap-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Cupón"
            className="rounded border px-3 py-2"
          />
          <button
            onClick={applyCoupon}
            className="rounded bg-gray-800 px-4 text-white"
          >
            Aplicar
          </button>
        </div>

        <div className="w-72 space-y-1 text-right">
          <p>Subtotal: {formatPrice(subtotal)}</p>
          {discount > 0 && <p>Descuento: -{formatPrice(discount)}</p>}
          <p>Envío: {shipping === 0 ? "Gratis" : formatPrice(shipping)}</p>
          <p className="text-2xl font-bold">Total: {formatPrice(total)}</p>
          <Link
            href="/checkout"
            className="mt-4 inline-block rounded-lg bg-amber-700 px-6 py-3 text-white"
          >
            Continuar al pago
          </Link>
        </div>
      </div>
    </div>
  );
}
