import { Link, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function ErrorPage() {
  const error = useRouteError() as Error

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">
        Ooops! Algo deu errado.{' '}
        <span role="img" aria-label="Emoji de tristeza">
          😢
        </span>
      </h1>
      <p className="text-accent-foreground">
        Um erro aconteceu enquanto você tentava acessar a página, abaixo você
        pode ver mais detalhes sobre o erro:
      </p>

      <pre>{error?.message ?? JSON.stringify(error)}</pre>

      <p className="text-accent-foreground">
        Voltar para o{' '}
        <Button asChild variant="link" className="p-0">
          <Link to="/">Dashboard</Link>
        </Button>
      </p>
    </div>
  )
}

export default ErrorPage
