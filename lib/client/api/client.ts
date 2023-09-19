import request, {
  post as postReq,
  remove as removeReq,
  GetRequestOptions,
  PostRequestOptions
} from './request'

export const get = async <ResponsePayload>(
  url: string,
  ctx: GetRequestOptions = {}
) => request<unknown, ResponsePayload>(url, ctx)

export const post = async <RequestPayload, ResponsePayload = unknown>(
  url: string,
  data: RequestPayload,
  ctx: PostRequestOptions = {}
) => postReq<RequestPayload, ResponsePayload>(url, data, ctx)

export const remove = async <ResponsePayload>(
  url: string,
  ctx: PostRequestOptions = {}
) => removeReq<ResponsePayload>(url, ctx)

const client = {
  get,
  post,
  remove
}

export default client
