import React from 'react';
import { getLayout } from '~/components/SiteLayout';
import { SectionContext } from '~/context';
import roadmap from '~/data/roadmap.json';

const statusColors = {
  'In Progress': 'bg-yellow-500',
  Done: 'bg-green-500',
  Planned: 'bg-blue-500',
  Unknown: 'bg-gray-500',
};

const effortColors = {
  Low: 'bg-green-100 text-green-800 border-green-300',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  High: 'bg-red-100 text-red-800 border-red-300',
  Unknown: 'bg-gray-100 text-gray-800 border-gray-300',
};

const impactColors = {
  Low: 'bg-blue-100 text-blue-800 border-blue-300',
  Medium: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  High: 'bg-purple-100 text-purple-800 border-purple-300',
  Unknown: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function Roadmap() {
  const date = new Date().getFullYear();
  return (
    <SectionContext.Provider value='roadmap'>
      <div className='min-h-screen bg-gray-900 text-white py-16'>
        <div className='container mt-20 mx-auto px-4'>
          <h1 className='text-h3 font-bold text-center mb-16'>
            Roadmap {date}
          </h1>

          <div className='relative'>
            <div className='lg:block absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-blue-400 to-purple-500 z-0'></div>

            {roadmap.map((item, index) => {
              const status =
                item.fieldValues.nodes.find(
                  (node) => node.field?.name === 'Status',
                )?.name || 'Unknown';
              const category =
                item.fieldValues.nodes.find(
                  (node) => node.field?.name === 'Category',
                )?.name || 'Uncategorized';
              const effort =
                item.fieldValues.nodes.find(
                  (node) => node.field?.name === 'Effort',
                )?.name || 'Unknown';
              const impact =
                item.fieldValues.nodes.find(
                  (node) => node.field?.name === 'Impact',
                )?.name || 'Unknown';

              return (
                <div
                  key={item.id}
                  className={`relative z-10 mb-12 flex flex-col lg:flex-row ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className='w-full flex justify-center mb-4 lg:hidden'>
                    <div className='w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full z-10'></div>
                  </div>

                  <div
                    className={`lg:w-5/12 ${
                      index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'
                    } w-full`}
                  >
                    <div className='bg-gray-800 relative z-10 rounded-lg overflow-hidden border border-gray-700 shadow-lg'>
                      <div className='p-6'>
                        <span className='inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4'>
                          {category}
                        </span>
                        <h2 className='text-2xl font-bold mb-3'>
                          {item.content.title}
                        </h2>
                        <div className='flex flex-wrap mb-3'>
                          {item.content.assignees.nodes.map(
                            (assignee, index) => (
                              <span
                                key={index}
                                className='text-sm text-gray-400 mr-2 mb-1'
                              >
                                @{assignee.login}
                              </span>
                            ),
                          )}
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span
                            className={`px-2 py-1 rounded ${
                              effortColors[
                                effort as keyof typeof effortColors
                              ] || effortColors['Unknown']
                            }`}
                          >
                            Effort: {effort}
                          </span>
                          <span
                            className={`px-2 py-1 rounded ${
                              impactColors[
                                impact as keyof typeof impactColors
                              ] || impactColors['Unknown']
                            }`}
                          >
                            Impact: {impact}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-6 py-3 ${
                          statusColors[status as keyof typeof statusColors] ||
                          statusColors['Unknown']
                        }`}
                      >
                        <span className='text-sm font-semibold text-white uppercase'>
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='hidden lg:flex lg:w-2/12 justify-center items-center'>
                    <div className='w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full z-10'></div>
                  </div>

                  <div className='lg:w-5/12 w-full'></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

Roadmap.getLayout = getLayout;
