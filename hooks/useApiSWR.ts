import useSWR, { SWRConfiguration } from "swr";
import api from "../lib/client/api/fetcher";

const useApiSWR = <T = unknown>(
  key: null | string,
  config?: SWRConfiguration<T> & { disableLoad?: boolean; baseUrl?: string }
) => {
  const { disableLoad = false, baseUrl } = config || {};
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    !disableLoad ? key : null,
    api<T>(baseUrl),
    config
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};

export default useApiSWR;
