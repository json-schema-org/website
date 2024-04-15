import React, { useEffect, useState } from 'react';
import fs from 'fs';
import yaml from 'js-yaml';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';

type ResourcesProps = {
  title: string;
  url: string;
  type: string;
  summary: string;
};

type ParamProps = {
  slug: string;
};

type DataProps = {
  slug: string;
  data: ResourcesProps[];
};

export async function getStaticPaths() {
  const paths = [
    { params: { slug: 'books' } },
    { params: { slug: 'articles' } },
    { params: { slug: 'courses' } },
    { params: { slug: 'videos' } },
    { params: { slug: 'podcasts' } },
    { params: { slug: 'papers' } },
  ];
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: ParamProps }) {
  const { slug } = params;
  const data = await fetchResourceData(slug);

  return {
    props: {
      data,
    },
  };
}
export default function ResourcePageComponent({ data }: { data: DataProps }) {
  const { slug, data: resourceData } = data;
  const routeName = slug.slice(0, -1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(
    resourceData?.filter((item: ResourcesProps) => item.type === routeName),
  );
  useEffect(() => {
    const results = resourceData.filter(
      (item: ResourcesProps) =>
        item.type === routeName &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredArticles(results);
  }, [searchTerm, resourceData]);
  function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  const newTitle = capitalizeFirstLetter(slug);

  return (
    <section>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      Welcome to the {`${newTitle}`} section. Please use the search box to
      search for specific terms.
      <div className='mt-6'>
        <input
          type='text'
          name='text'
          placeholder={`Search ${newTitle}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300'
        />
        {filteredArticles &&
          filteredArticles.map((item: ResourcesProps, index: number) => (
            <div key={index} className='p-3'>
              <a
                href={item.url}
                target='_blank'
                rel='noreferrer'
                className='text-[14px] text-blue-500 underline mb-2'
              >
                {item.title}
              </a>
              <p className='text-[14px] mt-2'>{item.summary}</p>
            </div>
          ))}
      </div>
    </section>
  );
}

const fetchResourceData = async (slug: string) => {
  try {
    const data = yaml.load(fs.readFileSync('data/resources.yml', 'utf8'));
    return {
      slug,
      data: data,
    };
  } catch (error) {
    console.error('Error fetching data');
    return { slug, dummyData: 'No Data Found' };
  }
};
ResourcePageComponent.getLayout = getLayout;
