import React from 'react'
import Heading from '../typography/Heading';

export default function Card(props) {
    return (
        <div className="z-40 mt-20 bg-white w-full md:h-130 rounded-lg shadow-xl md:flex grid grid-cols-2 justify-between">
            <div className="p-10 flex justify-between w-full md:w-2/5 h-auto flex-col text-center md:text-left">
                <div data-testid="HomeCard-main">
                    <Heading
                        level="h2"
                        typeStyle="heading-md"
                        textColor="text-purple-300"

                    >
                        {props.headline}
                    </Heading>
                </div>
                <div data-testid="HomeCard-title">
                    <Heading level="h2" typeStyle="heading-lg" className="mt-10" >
                        {props.title}
                    </Heading>
                    <Heading
                        level="h2"
                        typeStyle="body-lg"
                        textColor="text-gray-700"
                        className="text-slate-500 text-sm mt-10"
                    >
                        {props.description}
                    </Heading>
                    <div className="mt-10" data-testid="HomeCard-button">
                        <button
                            className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
                            onClick={() => window.open('https://github.com/orgs/json-schema-org/discussions', '_blank')}>
                            {props.btnText}
                        </button>
                    </div>
                </div>
            </div>
            <div className={`w-full h-fit-content md:w-3/6 flex justify-end bg-cover bg-center ${props.className}`} >
             <img className=' rounded-r-lg' src={props.img} alt="naruto" /> 
            </div>
        </div>
    );
}