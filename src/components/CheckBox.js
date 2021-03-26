const CheckBox = ({ onFilterCheckboxChange, isChecked }) => {

  return (
    <div>
      <input onClick={onFilterCheckboxChange} checked={isChecked} type="checkbox" />
      <span>Use Filters</span>
    </div>
  );

};

export default CheckBox;