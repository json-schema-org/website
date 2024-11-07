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
  bowtie?: BowtieData;
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

export interface BowtieData {
  id: string;
  dialects: Array<string>;
  badges_urls: {
    supported_versions: string;
    compliance: {
      [dialectURI: string]: string;
    };
  };
}

export interface BowtieReport {
  [source: string]: BowtieData;
}
