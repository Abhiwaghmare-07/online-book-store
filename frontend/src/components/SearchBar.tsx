import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
}) => {
  return (
    <form className="search-bar-form" onSubmit={onSearchSubmit}>
      <div className="search-input-group">
        <input
          type="text"
          className="search-input"
          placeholder="Search books by title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={onClearSearch}
            title="Clear search"
          >
            ✕
          </button>
        )}
        <button type="submit" className="search-btn">
          Search
        </button>
      </div>
    </form>
  );
};
