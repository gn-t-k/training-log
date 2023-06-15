/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const pagesPath = {
  $url: (url?: { hash?: string }) => ({
    pathname: "/" as const,
    hash: url?.hash,
  }),
};

export type PagesPath = typeof pagesPath;
