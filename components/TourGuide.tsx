import React, {useState, useEffect} from 'react';
import Joyride from 'react-joyride';

const steps = [
  {
    target: 'a[href="/"]',
    content:'Click here to return to the homepage anytime.',
  },
  {
    target: 'a[href="/specification"]',
    content:'Explore JSON Schema specifications, which outline the structure and validation rules for JSON data.',
  },
  {
    target: 'a[href="/docs"]',
    content:'Find comprehensive guides and documentation to help you implement JSON Schema effectively.',
  },
  {
    target: 'a[href="/tools?query=&sortBy=name&sortOrder=ascending&groupBy=toolingTypes&licenses=&languages=&drafts=&toolingTypes=&environments="]',
    content:'Discover useful tools and utilities to work with JSON Schema more efficiently.',
  },
  {
    target: 'a[href="/blog"]',
    content:'Read the latest updates, announcements, and articles about JSON Schema.',
  },
  {
    target: 'a[href="/community"]',
    content:'Join the community to connect with developers, ask questions, and contribute.',
  },
  {
    target: 'a[href="https://github.com/json-schema-org/json-schema-spec"]',
    content:'Star us on GitHub to support and follow our project!',
  },
  {
    target: 'a[href="/learn"]',
    content:'Click here to start exploring JSON Schema documentation and guides!',
  },
  {
    target: 'a[href="/slack"]',
    content:'Join us on Slack to connect with the community for support.',
  },
  {
    target: 'a[href="/slack"]+.herobtn',
    content: 'Use the search to find resources quickly.',
  },
];
export default function TourGuide(){
    const [run, setRun] = useState(false);
    const [isClient, setIsClient] = useState(false);
    useEffect(()=>{setIsClient(true)},[]);
    return (
      <>
        <button
          onClick={() => setRun(true)}
          className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >Start Tour</button>
        {isClient && (<Joyride
          steps={steps}
          run={run}
          continuous={true}
          showSkipButton={true}
          disableScrolling={true}
          styles={{
              options: {
                arrowColor: '#fff',
                backgroundColor: '#fff',
                overlayColor: 'rgba(0, 0, 0, 0.5)',
                primaryColor: '#5468FF',
                textColor: '#000',
                zIndex:1000
              }
          }}
          callback={(data) => {
            if (data.status === 'finished' || data.status === 'skipped') {
              setRun(false);
            }
          }}
      />)}</>
    );
  }
    