// src/components/SearchResult.jsx
import React from 'react';

// This component highlights the search term in the text
const SearchResult = ({ text, query }) => {
  if (!query) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index}>{part}</mark> // <mark> highlights the text
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default SearchResult;