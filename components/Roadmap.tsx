import React from 'react';
import { Headline1 } from './Headlines';
import Image from 'next/image';
import roadmap from 'public/roadmap.png';

const Roadmap = () => {
  return (
    <div className=''>
      <Headline1>JSON SCHEMA ROADMAP</Headline1>
      <p className='mb-4'>
        Exciting news! We've successfully crafted the roadmap for 2023-2024 🎉
        through dedicated teamwork and collaboration within our vibrant
        community. We invite each of you to embark on this thrilling journey
        with us as we tackle the most pressing challenges facing JSON Schema.
        Together, let's pave the way for a brighter future for JSON Schema!
      </p>
      <p className='mb-4'>
        For full transparency and inclusivity, we've meticulously documented our
        roadmap on GitHub. Dive into the details and track our progress
      </p>
      <div className=' my-8'>
        <a
          href='https://github.com/orgs/json-schema-org/projects/14/views/13'
          className='text-blue-500'
        >
          <Image src={roadmap} alt='Roadmap' />
        </a>
      </div>
      <p className='mb-4'>
        This roadmap emerged from a dynamic two-day in-person summit, where we
        pinpointed the most significant issues to address. For those eager to
        delve deeper into the summit's discussions, including the agenda, notes,
        and comprehensive write-up, we invite you to explore the summit report{' '}
        <a href='link-to-summit-report' className='text-blue-500'>
          here
        </a>
        .
      </p>
      <h2 className='text-2xl font-bold mb-4'>
        Our primary goals for 2023-2024 include:
      </h2>
      <ul className='list-disc list-inside mb-4'>
        <li>Enhancing the Contributor's Experience</li>
        <li>Strategizing to better support Implementers</li>
        <li>Identifying crucial interfaces for implementations</li>
        <li>Finalizing the new version of the Spec</li>
        <li>Launching the new webpage</li>
        <li>Completing the OpenJS onboarding</li>
        <li>Conducting research on existing implementations by language</li>
        <li>Crafting a sustainability strategy</li>
        <li>Establishing and implementing the documentation strategy</li>
        <li>Adopting and scaling the new governance model</li>
        <li>Improving public communications strategy</li>
      </ul>
      <p className='mb-4'>
        We encourage you to review the roadmap on this board. Each objective has
        its dedicated GitHub issue. Some issues are marked as "unspecified,"
        signaling the need for collaborative input from our community to define
        success criteria, deliverables, and task breakdowns.
      </p>
      <p className='mb-4'>
        <strong>A Call for Collaborators!</strong> While individuals are
        currently assigned to each issue, we're actively seeking contributors!
        We warmly welcome and encourage everyone to contribute to tasks where
        they believe they can make a valuable impact.
      </p>
      <p>Join us in shaping the future of JSON Schema!</p>
    </div>
  );
};

export default Roadmap;
