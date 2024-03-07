import React from "react";

function Button(props){
return(
    <a
    href={props.href}
    target='_blank'
    rel='noopener noreferrer'
    className={`bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none ${props.class}`}
>
    {props.btnText}
</a>
)
}
export default Button;

