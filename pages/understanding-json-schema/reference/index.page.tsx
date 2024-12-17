import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';

export default function Welcome() {
  const markdownFile = '_indexPage';

  const newTitle = 'JSON Schema Reference';
  return (
    <SectionContext.Provider value='learn'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        Master the full power of JSON Schema with our reference documentation.
        <br/> 
        <br/>
        From basic data types to advanced techniques like conditional validation and schema composition, you will learn everything about JSON Schema keywords through clear explanations and examples.
        By learning best practices for building clear, scalable, and easy-to-maintain schemas, you will ensure that your JSON data is both robust and flexible.        
        <br />
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        <Card
          title='Learn JSON Schema'
          body='Improve your JSON Schema skills with this reference, crafted by our TSC members, offering practical examples, best practices, and common pitfalls.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://www.learnjsonschema.com/2020-12/'
        />
        <Card
          title='Keywords'
          body='Browse our comprehensive index of JSON Schema keywords, each linking to detailed documentation.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://tour.json-schema.org/'
        />
        <Card
          title='Data types'
          body='Become profficient at using the type keyword to validate your data.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://tour.json-schema.org/'
        />
        <Card
          title='Value restrictions'
          body='Ensure data consistency and accuracy, by defining value sets and fixed values for your JSON properties.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://tour.json-schema.org/'
        />
        <Card
          title='Annotations and comments'
          body='Enhance your JSON Schemas with annotations and comments. Learn how to add descriptions, defaults, examples, and more to improve readability and maintainability.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://tour.json-schema.org/'
        />
        <Card
          title='Schema composition'
          body='Learn how to combine JSON Schemas using modular and boolean techniques to create flexible and maintainable data models.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://tour.json-schema.org/'
        />
      </div>
      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;