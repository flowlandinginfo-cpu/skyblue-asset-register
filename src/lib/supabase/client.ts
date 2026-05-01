import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // During build/SSR env vars may not be available — return a lazy proxy
    // that defers the error until an actual API call is made at runtime
    if (typeof window === 'undefined') {
      return null as unknown as ReturnType<typeof createBrowserClient>
    }
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  client = createBrowserClient(supabaseUrl, supabaseKey)

  return client
}
