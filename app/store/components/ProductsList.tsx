import { useTransaction } from '@/contexts/TransactionContext';
import Product from '@/models/product';

export function ProductsList() {

  const products = [
    new Product(1, 'Simba', '/products/100.jpg', 0.05),
    new Product(2, 'Médor', '/products/101.jpg', 0.08),
    new Product(3, 'Rex', '/products/102.jpg', 0.5),
    new Product(4, 'Fido', '/products/103.jpg', 0.13),
    new Product(5, 'Iggy', '/products/104.jpg', 0.22),
    new Product(6, 'Tobby', '/products/105.jpg', 0.18),
    new Product(7, 'Sharik', '/products/106.jpg', 0.24),
    new Product(8, 'Pochi', '/products/107.jpg', 0.01),
    new Product(9, 'Burek', '/products/108.jpg', 10),
    new Product(10, 'Xiǎobái', '/products/109.jpg', 0.1),
    new Product(11, 'Max', '/products/110.jpg', 0.01),
    new Product(12, 'Bubi', '/products/111.jpg', 0.01),
    new Product(13, 'Bosse', '/products/112.jpg', 0.02),
    new Product(14, 'Fifis', '/products/113.jpg', 0.05)
  ];

  const transaction = useTransaction();

  return (
    <div>
      <h1 className="title">{transaction.product === null 
        ? 'Select buddy' 
        : <p className="back" onClick={() => transaction.selectProduct(null)}>&larr; Back to buddies</p>}</h1>
      <div className="grid">
        {products?.map(product => (
          <div key={product.id} 
            className={transaction.product !== null ? "selectedProduct" : "product"}
            hidden={transaction.product !== null && transaction.product?.id !== product.id}
            onClick={transaction.product === null ? () => transaction.selectProduct(product) : () => {}}>
            <p className="name">{product.name}</p>
            <img src={product.image} alt={`Product ${product.name} / ${product.id}`} className="image" />
            <p className="price">{product.price} SOL</p>
          </div> ))}
      </div>
      <style jsx>{`
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
            gap: 20px;
            margin: 20px;
            justify-content: center;
            align-content: center;
          }

          .selectedProduct {
            border: 1px solid #ccc;
            padding: 10px;
            justify-content: center;
            border-radius: 10px;
            cursor: auto;
          }
          
          .product {
            border: 1px solid #ccc;
            padding: 10px;
            justify-content: center;
            border-radius: 10px;
            cursor: pointer;
          }

          .product:hover {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          }

          .product:hover .image {
            transform: scale(1.03);
          }

          .name {
            text-align: center;
            font-size: 20px;
            text-transform: uppercase;
          }

          .price {
            text-align: center;
            font-size: 16px;
            text-transform: uppercase;
            margin-top: 10px;
          }
          
          .image {
            border: 1px solid #ccc;
            width: 100%;
            height: auto;
            border-radius: 10px;
          }

          .title {
            font-size: 28px;
            text-align: center;
            text-transform: uppercase;
            margin-top: 40px;
            color: #000;

          .back {
            text-align: left;
            font-size: 20px;
            text-transform: uppercase;
            margin-left: 20px;
            cursor: pointer;
          }
  
          }
      `}</style>
    </div>
  );
}
