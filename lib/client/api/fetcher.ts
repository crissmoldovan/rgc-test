import { get } from "./client";
import pick from "lodash/pick";

export const apiFetcher =
  <T>(baseUrl?: string) =>
  async (path: string): Promise<T> => {
    const { status, error, ...data } = await get<T>(path, { baseUrl });

    if (!status || error) {
      const error = new Error("An error occurred while fetching the data.");
      // @ts-ignore
      error.info = error;
      throw error;
    }

    return data as T;
  };

const extractKeys = <T>(
  keys: string | string[] | null | undefined,
  data: any
) => {
  if (typeof keys === "string") {
    return data[keys] as T;
  }

  if (Array.isArray(keys)) {
    return pick(data, keys) as T;
  }

  return data as T;
};

apiFetcher.extract =
  <T>(keys = null) =>
  async (path: string): Promise<T> =>
    extractKeys<T>(keys, await apiFetcher(path));

export default apiFetcher;
