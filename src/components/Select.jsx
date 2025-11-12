import React, { useId } from "react";

function Select({ className = "", options = [], label, ...props }, ref) {
  const id = useId();
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="inline-block mb-1 pl-1 text-sm font-medium">{label}</label>}
      <select
        ref={ref}
        id={id}
        {...props}
        className={`px-3 py-2 text-black bg-white border border-gray-200 outline-none rounded-lg duration-200 focus:bg-gray-50 w-full ${className}`}
      >
        {options?.map((option) => (
          <option key={option} value={option} className="text-black bg-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
