export interface DiscoverySourceQuery {
  query: string;
  countryCode: string;
  region?: string;
  city?: string;
}

export interface DiscoverySourceResult {
  title: string;
  url: string;
  authority: string;
  snippet?: string;
}

export interface DiscoverySourceProvider {
  search(input: DiscoverySourceQuery): Promise<DiscoverySourceResult[]>;
}
