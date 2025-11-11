import React, { useId } from "react";

function Select({ className = "", options = [], label, ...props }, ref) {
  const id = useId;
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={className}></label>}
      <select
        ref={ref}
        id={id}
        {...props}
        className={`px-3 py-2 text-white border border-gray-200 outline-none rounded-lg duration-200 focus:bg-gray-50 ${className}`}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
