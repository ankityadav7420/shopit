import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Search = () => {
  const [keyword, setKeyword] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault(); // Corrected typo

    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={searchHandler}>
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Enter Product Name ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn" type="submit">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;