export const appFetcher = (url: string) => fetch(url).then((r) => r.json());

export const formatAddressToDisplay = (hash: string, before = 3, after = 5) => {
  return hash.substring(0, before) + '...' + hash.substring(hash.length - after);
};
