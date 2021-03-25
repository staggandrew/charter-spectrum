const DropDown = ({ name, data, currerntValue, onChange }) => {
  return (
    <div>
      <span>{`${name}`}: </span>
      <select value={currerntValue} name={`${name}`} onChange={onChange}>
        {
          data.map((value) => {
            return (
              <option value={value}>{value}</option>
            )
          })
        }
      </select>
    </div>
  );
};

export default DropDown;