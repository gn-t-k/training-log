export const pagesPath = {
  "login": {
    $url: (url?: { hash?: string }) => ({ pathname: '/login' as const, hash: url?.hash })
  },
  "trainees": {
    _trainee_id: (trainee_id: string | number) => ({
      "exercises": {
        $url: (url?: { hash?: string }) => ({ pathname: '/trainees/[trainee_id]/exercises' as const, query: { trainee_id }, hash: url?.hash })
      },
      "muscles": {
        _muscle_id: (muscle_id: string | number) => ({
          $url: (url?: { hash?: string }) => ({ pathname: '/trainees/[trainee_id]/muscles/[muscle_id]' as const, query: { trainee_id, muscle_id }, hash: url?.hash })
        }),
        $url: (url?: { hash?: string }) => ({ pathname: '/trainees/[trainee_id]/muscles' as const, query: { trainee_id }, hash: url?.hash })
      }
    }),
    "onboarding": {
      $url: (url?: { hash?: string }) => ({ pathname: '/trainees/onboarding' as const, hash: url?.hash })
    }
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath
