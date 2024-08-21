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
  source: string;
  homepage?: string;
  documentation?: object;
  supportedDialects?: {
    draft?: (number | string)[];
    additional?: {
      name: string;
      homepage?: string;
      source: string;
    }[];
  };
  bowtie?: {
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
}

export interface Person {
  name?: string;
  email?: string;
  username: string;
  platform: 'github' | 'gitlab' | 'bitbucket' | string;
}

export interface BowtieEntry {
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
  [source: string]: BowtieEntry;
}
