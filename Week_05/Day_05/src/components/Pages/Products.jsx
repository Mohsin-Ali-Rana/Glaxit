import React from "react";
import { Link } from "react-router-dom";
import { products } from "./ProductData";
import "./Products.css";

function Products() {
  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Explore our wide range of premium templates, tools, and assets.</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              <span className="product-category">{product.category}</span>
            </div>
            
            <div className="product-content">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              
              <div className="product-footer">
                <span className="product-price">{product.price}</span>
                <Link to={`/products/${product.id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
