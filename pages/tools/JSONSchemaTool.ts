import type { JSONSchemaDraft } from '~/lib/config';

export interface JSONSchemaTool {
  name: string;
  description?: string;
  toolingTypes: string[];
  languages?: string[];
  environments?: string[];
  dependsOnValidators?: string[];
  creators?: Person[];
  maintainers?: Person[];
  license?: string;
  source?: string;
  homepage?: string;
  documentation?: object;
  supportedDialects?: {
    draft?: JSONSchemaDraft[];
    additional?: {
      name: string;
      homepage?: string;
      source: string;
    }[];
  };
  bowtie?: {
    /** The identifier Bowtie gives the implementation, e.g. `js-ajv`. */
    identifier: string;
  };
  toolingListingNotes?: string;
  compliance?: {
    config?: {
      docs?: string;
      instructions?: string;
    };
  };
  landscape?: {
    logo?: string;
    optOut?: boolean;
  };
  lastUpdated?: string;
  status?: 'obsolete';
}

export interface Person {
  name?: string;
  email?: string;
  username?: string;
  platform?: 'github' | 'gitlab' | 'bitbucket' | string;
}

/** An implementation's metadata, as published by Bowtie. */
export interface BowtieImplementationMetadata {
  name: string;
  language: string;
  source: string;
  homepage?: string;
  dialects?: string[];
  version?: string;
}

/** The content of https://bowtie.report/implementations.json */
export interface BowtieImplementations {
  [id: string]: BowtieImplementationMetadata;
}

export interface BowtieImplementation extends BowtieImplementationMetadata {
  /** Bowtie's identifier for the implementation, e.g. `js-ajv`. */
  id: string;
  dialects: string[];
}
