import React, { forwardRef, useId } from "react";

const Input = forwardRef(function Input({
    label, 
    type = 'text',
    className = '',
    ...props
}, ref ) { {/* Someone using this forward reference will also pass this reference */}

    const id = useId;
    return (
        <div className="w-full">   
            {label && <label 
            className="inline-block mb-1 pl-1"
            htmlFor={id}></label>}
            <input 
            type = {type}
            className={`${className} px-3 py-2 rounded-lg outline-none text-black focus:bg-gray-50 duration-200 border w-full border-gray-200`}
            ref = {ref}
            {...props}
            id = {id}
            />
        </div>
    )
});

export default Input;
