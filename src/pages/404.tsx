import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p className="text-accent-foreground">
        Voltar para o{' '}
        <Button asChild variant="link" className="p-0">
          <Link to="/">Dashboard</Link>
        </Button>
      </p>
    </div>
  )
}

export default NotFound
