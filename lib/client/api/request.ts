export type RequestOptions<T = unknown> = {
  method?: string
  data?: T
  baseUrl?: string
}

export type RequestResponse<T> = T & {
  status: boolean
  error: any
}

export const request = async <RequestPayload, ResponsePayload>(
  url: string,
  { method = 'GET', data, baseUrl: _baseUrl }: RequestOptions<RequestPayload>
): Promise<RequestResponse<ResponsePayload>> => {
  const baseUrl = `${_baseUrl || process.env.EXPO_PUBLIC_API_HOST}/api`

  const finalUrl = `${baseUrl}/${url}`

  return await (
    await fetch(finalUrl, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      ...(method === 'POST' || method === 'PUT'
        ? { body: JSON.stringify(data) }
        : {})
    })
  ).json()
}

export type GetRequestOptions<D = unknown> = {
  data?: D
  baseUrl?: string
}

export const get = async <RequestPayload = unknown, ResponsePayload = unknown>(
  url: string,
  { data, baseUrl }: GetRequestOptions<RequestPayload>
): Promise<RequestResponse<ResponsePayload>> => {
  return request<unknown, ResponsePayload>(url, {
    method: 'GET',
    data,
    baseUrl
  })
}

export type PostRequestOptions = {
  baseUrl?: string
}

export const post = async <RequestPayload = unknown, ResponsePayload = unknown>(
  url: string,
  data: RequestPayload,
  { baseUrl }: PostRequestOptions
): Promise<RequestResponse<ResponsePayload>> => {
  return request<RequestPayload, ResponsePayload>(url, {
    method: 'POST',
    data,
    baseUrl
  })
}

export type DeleteRequestOptions = {
  baseUrl?: string
}

export const remove = async <ResponsePayload>(
  url: string,
  { baseUrl }: DeleteRequestOptions
): Promise<RequestResponse<ResponsePayload>> => {
  return request<unknown, ResponsePayload>(url, {
    method: 'DELETE',
    baseUrl
  })
}

export default request
