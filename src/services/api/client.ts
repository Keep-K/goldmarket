const DEFAULT_TIMEOUT_MS = 12000

export class ApiError extends Error {
  status?: number
  url?: string

  constructor(message: string, opts?: { status?: number; url?: string }) {
    super(message)
    this.name = 'ApiError'
    this.status = opts?.status
    this.url = opts?.url
  }
}

function withTimeout(signal?: AbortSignal, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const onAbort = () => controller.abort()
  if (signal) signal.addEventListener('abort', onAbort, { once: true })

  const timer = window.setTimeout(() => controller.abort(), timeoutMs)

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timer)
      if (signal) signal.removeEventListener('abort', onAbort)
    }
  }
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>, signal?: AbortSignal): Promise<T> {
  const url = new URL(path, window.location.origin)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue
      url.searchParams.set(k, String(v))
    }
  }

  const { signal: timeoutSignal, cleanup } = withTimeout(signal)
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: timeoutSignal
    })

    if (!res.ok) throw new ApiError(`요청에 실패했습니다. (${res.status})`, { status: res.status, url: url.toString() })
    return (await res.json()) as T
  } catch (e: unknown) {
    if (e instanceof ApiError) throw e
    if (e instanceof DOMException && e.name === 'AbortError') throw new ApiError('요청 시간이 초과되었습니다.', { url: url.toString() })
    throw new ApiError('네트워크 오류가 발생했습니다.', { url: url.toString() })
  } finally {
    cleanup()
  }
}
