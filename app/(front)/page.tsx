import ProductItem from '@/components/products/ProductItem'
import data from '@/lib/models/data'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <h2 className="text-2xl py-2">Latest product</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
    </>
  )
}
