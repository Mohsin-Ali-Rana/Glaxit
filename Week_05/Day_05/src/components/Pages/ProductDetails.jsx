import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "./ProductData";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    // Find the product by id
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="product-details-page error-state">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/products" className="back-link">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <Link to="/products" className="back-link">
          ← Back to Products
        </Link>
        
        <div className="product-details-grid">
          <div className="details-image-container">
            <img 
              src={product.image} 
              alt={product.title} 
              className="details-image"
            />
          </div>
          
          <div className="details-content">
            <span className="details-category">{product.category}</span>
            <h1 className="details-title">{product.title}</h1>
            <p className="details-price">{product.price}</p>
            
            <div className="details-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="details-features">
              <h3>Key Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="details-actions">
              <button className="primary-btn">Add to Cart</button>
              <button className="secondary-btn">Live Preview</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
