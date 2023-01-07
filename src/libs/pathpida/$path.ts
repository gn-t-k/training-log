export const pagesPath = {
  "hello": {
    $url: (url?: { hash?: string }) => ({ pathname: '/hello' as const, hash: url?.hash })
  },
  "logged_in": {
    $url: (url?: { hash?: string }) => ({ pathname: '/logged-in' as const, hash: url?.hash })
  },
  "login": {
    $url: (url?: { hash?: string }) => ({ pathname: '/login' as const, hash: url?.hash })
  },
  "muscles": {
    $url: (url?: { hash?: string }) => ({ pathname: '/muscles' as const, hash: url?.hash })
  },
  "onboarding": {
    $url: (url?: { hash?: string }) => ({ pathname: '/onboarding' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath
