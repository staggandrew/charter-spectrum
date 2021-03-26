const PageSelector = ({ onPageLeftClick, onPageRightClick, pageNumber, pageCount}) => {
  return (
    <div>
      <div className="pagination">
        <span className="left" onClick={onPageLeftClick} >&laquo;</span>
        <span className="right" onClick={onPageRightClick} >&raquo;</span>
      </div>
      <span>Page {pageNumber + 1} of {pageCount}</span>
    </div>
  );
};

export default PageSelector;