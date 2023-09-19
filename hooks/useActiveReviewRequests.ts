import useApiSWR from './useApiSWR'

export type VideoReviewProduct = {
  name: string
  seoName: string
  imageUrl: string
  score: number
  description: string
}

export type VideoReviewProductBrand = {
  name: string
  seoName: string
  imageUrl: string
  score: number
  id: string
}

export type ProductVideoReviewRequest = {
  id: string
  productId: string
  isActive: boolean
  createdAt: Date
}

export type ReviewRequest = ProductVideoReviewRequest & {
  product: VideoReviewProduct
  brand: VideoReviewProductBrand
}

export type ActiveReviewRequestsResponse = {
  activeRequests: ReviewRequest[]
}
const useActiveReviewRequests = () => {
  const {
    data,
    mutate: refresh,
    ...rest
  } = useApiSWR<ActiveReviewRequestsResponse>('video-reviews/active-requests')

  const { activeRequests } = data || {}

  return {
    activeRequests,
    refresh,
    ...rest
  }
}

export default useActiveReviewRequests
