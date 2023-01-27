export const pagesPath = {
  "logged_in": {
    $url: (url?: { hash?: string }) => ({ pathname: '/logged-in' as const, hash: url?.hash })
  },
  "login": {
    $url: (url?: { hash?: string }) => ({ pathname: '/login' as const, hash: url?.hash })
  },
  "onboarding": {
    $url: (url?: { hash?: string }) => ({ pathname: '/onboarding' as const, hash: url?.hash })
  },
  "settings": {
    "exercises": {
      _id: (id: string | number) => ({
        $url: (url?: { hash?: string }) => ({ pathname: '/settings/exercises/[id]' as const, query: { id }, hash: url?.hash })
      }),
      "register": {
        $url: (url?: { hash?: string }) => ({ pathname: '/settings/exercises/register' as const, hash: url?.hash })
      },
      $url: (url?: { hash?: string }) => ({ pathname: '/settings/exercises' as const, hash: url?.hash })
    },
    "muscles": {
      _id: (id: string | number) => ({
        $url: (url?: { hash?: string }) => ({ pathname: '/settings/muscles/[id]' as const, query: { id }, hash: url?.hash })
      }),
      "register": {
        $url: (url?: { hash?: string }) => ({ pathname: '/settings/muscles/register' as const, hash: url?.hash })
      },
      $url: (url?: { hash?: string }) => ({ pathname: '/settings/muscles' as const, hash: url?.hash })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/settings' as const, hash: url?.hash })
  },
  "trainings": {
    _id: (id: string | number) => ({
      $url: (url?: { hash?: string }) => ({ pathname: '/trainings/[id]' as const, query: { id }, hash: url?.hash })
    }),
    "register": {
      $url: (url?: { hash?: string }) => ({ pathname: '/trainings/register' as const, hash: url?.hash })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/trainings' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath
