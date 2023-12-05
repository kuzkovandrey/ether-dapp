export const appFetcher = (url: string) => fetch(url).then((r) => r.json());
