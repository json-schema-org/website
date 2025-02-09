import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';

export default function Welcome() {
  const fileRenderType = 'tsx';

  const newTitle = 'JSON Schema reference';
  return (
    <SectionContext.Provider value='learn'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        Master the full power of JSON Schema with our reference documentation.
        <br />
        From basic data types to advanced techniques like conditional validation
        and schema composition, you will learn everything about JSON Schema
        keywords through clear explanations and examples. By learning best
        practices for building clear, scalable, and easy-to-maintain schemas,
        you will ensure that your JSON data is both robust and flexible.
        <br />
      </p>
      <div className='w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8'>
        <Card
          title='Keywords'
          body='Browse our comprehensive index of JSON Schema keywords, each linking to detailed documentation.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='/understanding-json-schema/keywords'
        />
        <Card
          title='Type-specific Keywords'
          body='Become profficient at using the type keyword to validate your data.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='./reference/type'
        />
        <Card
          title='Dialect and vocabulary declaration'
          body='Learn how to declare the JSON Schema dialect and vocabulary your schema uses, ensuring compatibility and proper validation.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='./reference/schema'
        />
        <Card
          title='Enumerated and Constant Values'
          body='Ensure data consistency and accuracy, by defining value sets and fixed values for your JSON properties.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='./reference/generic'
        />
        <Card
          title='Annotations and comments'
          body='Enhance your JSON Schemas with annotations and comments. Learn how to add descriptions, defaults, examples, and more to improve readability and maintainability.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='./reference/metadata'
        />
        <Card
          title='Conditional schema validation'
          body='Control validation based on property presence and values using conditional subschemas.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='./reference/conditionals'
        />
        <Card
          title='Schema composition'
          body='Learn how to combine JSON Schemas using modular and boolean techniques to create flexible and maintainable data models.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='./reference/composition'
        />
        <Card
          title='String-encoding non-JSON data'
          body='Describe and handle non-JSON data within JSON strings using media type and encoding information.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='./reference/non_json_data'
        />
        <Card
          title='Learn JSON Schema'
          body='Improve your JSON Schema skills with this reference, crafted by our TSC members, offering practical examples, best practices, and common pitfalls.'
          headerSize='medium'
          bodyTextSize='small'
          extended={true}
          link='https://www.learnjsonschema.com/2020-12/'
        />
      </div>
      <NextPrevButton
        prevLabel='Understanding common interfaces'
        prevURL='/implementers/interfaces'
        nextLabel='JSON Schema keywords'
        nextURL='/understanding-json-schema/keywords'
      />
      <DocsHelp fileRenderType={fileRenderType} />
    </SectionContext.Provider>
  );
}
Welcome.getLayout = getLayout;
