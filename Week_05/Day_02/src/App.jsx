import React, { useState } from 'react';
import './App.css'; // Importing our custom CSS

// The dataset mapping out the FAQs
const faqData = [
  {
    id: 1,
    question: "What is the Virtual DOM?",
    answer: "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to figure out what parts of the UI need to change before updating the real browser DOM, which makes rendering much faster."
  },
  {
    id: 2,
    question: "Why do we need keys in React lists?",
    answer: "Keys help React identify which items have changed, are added, or are removed. They should be given to the elements inside the map() array to give the elements a stable identity."
  },
  {
    id: 3,
    question: "What is the difference between state and props?",
    answer: "Props are passed down from a parent component to a child component and are read-only. State is managed within the component itself and can be updated using the useState hook."
  },
  {
    id: 4,
    question: "Can multiple accordions be open at once here?",
    answer: "No. Because we are storing a single integer (the ID of the active item) in our state instead of an array of IDs, mathematically only one item can be active at a time."
  }
];

function App() {
  // Local state to track which FAQ is open. Default is null (all closed)
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    // If the clicked ID matches the open ID, close it. Otherwise, open the new one.
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="accordion-container">
      <h2 className="accordion-title">React Concepts FAQ</h2>
      
      <div className="accordion-list">
        {faqData.map((faq) => (
          <div key={faq.id} className="accordion-item">
            
            {/* The Trigger Button */}
            <button
              onClick={() => toggleAccordion(faq.id)}
              className={`accordion-button ${openId === faq.id ? 'active' : ''}`}
            >
              {faq.question}
              <span className="icon">
                {openId === faq.id ? '−' : '+'}
              </span>
            </button>
            
            {/* The Answer Content (Renders only if openId matches this faq.id) */}
            {openId === faq.id && (
              <div className="accordion-content">
                {faq.answer}
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;