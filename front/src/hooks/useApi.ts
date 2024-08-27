import React from "react";
import { useAppContext } from "@/context/app";

type UseApiHook = {
  token?: string | null;
  apiBase: string;
  buildUri: <Q = Record<string, string>>(
    path: string,
    query?: Q,
    headers?: HeadersInit
  ) => string;
  apiPost: <B = unknown, R = unknown>(
    path: string,
    body: B,
    headers?: HeadersInit
  ) => Promise<R>;
  noBodyApiPost: <R = unknown>(
    path: string,
    headers?: HeadersInit
  ) => Promise<R>;
  apiPut: <B = unknown, R = unknown>(
    path: string,
    body: B,
    headers?: HeadersInit
  ) => Promise<R>;
  apiPatch: <B = unknown, R = unknown>(
    path: string,
    body: B,
    headers?: HeadersInit
  ) => Promise<R>;
  apiGet: <R = unknown, Q = Record<string, string>>(
    path: string,
    query?: Q,
    headers?: HeadersInit
  ) => Promise<R>;
  noAuthGet: <R = unknown, Q = Record<string, string>>(
    path: string,
    query?: Q,
    headers?: HeadersInit
  ) => Promise<R>;
  apiDelete: (path: string) => Promise<Response>;
};

const useApi = (): UseApiHook => {
  const {
    auth: { user },
  } = useAppContext();
  const token = user?.token; // || sessionStorage.getItem("user_token");
  const apiBase = "https://helpiamakerdevelop.com/"; //"https://nicoiatest.com/""https://helpiabot.com/"

  const buildUri = <Q = Record<string, string>>(
    path: string,
    query?: Q
  ): string => {
    const fullUrl = `${apiBase}${path}`;
    const keys: Array<keyof Q> = query
      ? (Object.keys(query) as Array<keyof Q>)
      : [];
    if (query && keys.length > 0) {
      const params = new URLSearchParams();

      for (const k of keys) {
        if (query[k]) {
          params.append(String(k), String(query[k]));
        }
      }
      return fullUrl.concat(`?${params.toString()}`);
    }
    return fullUrl;
  };

  const noBodyApiPost = React.useCallback(
    <R>(path: string): Promise<R> => {
      return new Promise((resolve, reject) => {
        fetch(buildUri(path), {
          method: "POST",
          headers: {
            //...(token && {Authorization: `Bearer ${token}`}),
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then(async (resp) => {
            if (resp.status === 200 || resp.status === 201) {
              return resolve(await resp.json());
            }
            return reject(
              new Error(`Status: [${resp.status}] ${await resp.json()}`)
            );
          })
          .catch((err) => reject(err));
      });
    },
    [
      /* token */
    ]
  );

  const apiPost = React.useCallback(
    <B, R>(path: string, body: B /* , headers?: HeadersInit */): Promise<R> => {
      return new Promise((resolve, reject) => {
        fetch(buildUri(path), {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            //...(token && {Authorization: `Bearer ${token}`}),
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then(async (resp) => {
            if (resp.status === 200 || resp.status === 201) {
              return resolve(await resp.json());
            }
            return reject({
              status: resp.status,
              error: resp.statusText,
              data: await resp.json(),
            });
          })
          .catch((err) => reject(err));
      });
    },
    [
      /* token */
    ]
  );

  const apiPut = React.useCallback(
    <B, R>(path: string, body: B /* headers?: HeadersInit */): Promise<R> => {
      return new Promise((resolve, reject) => {
        fetch(buildUri(path), {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            //...(token && {Authorization: `Bearer ${token}`}),
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            //...(headers && { ...headers }),
          },
        })
          .then(async (resp) => {
            if (resp.status === 200 || resp.status === 201) {
              return resolve(await resp.json());
            }
            return reject(
              new Error(`Status: [${resp.status}] ${await resp.json()}`)
            );
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [
      /* token */
    ]
  );

  const apiPatch = React.useCallback(
    <B, R>(path: string, body: B /* headers?: HeadersInit */): Promise<R> => {
      return new Promise((resolve, reject) => {
        fetch(buildUri(path), {
          method: "PATCH",
          body: JSON.stringify(body),
          headers: {
            //...(token && {Authorization: `Bearer ${token}`}),
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            //...(headers && { ...headers }),
          },
        })
          .then(async (resp) => {
            if (resp.status === 200 || resp.status === 201) {
              return resolve(await resp.json());
            }
            return reject({
              status: resp.status,
              error: resp.statusText,
              data: await resp.json(),
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [
      /* token */
    ]
  );

  const noAuthGet = React.useCallback(
    <R, Q = Record<string, string>>(
      path: string,
      query?: Q
      //headers?: HeadersInit
    ): Promise<R> => {
      return new Promise((resolve, reject) => {
        fetch(buildUri(path, query), {
          method: "GET",
          headers: {
            /*...(token && { Authorization: `Bearer ${token}` }),*/
            "Content-Type": "application/json",
            /*   "Accept" : "/", */
            /*   "Access-Control-Allow-Origin": "*" */
            /*...(headers && { ...headers }), */
          },
        })
          .then(async (resp) => {
            if (resp.status === 200 || resp.status === 201) {
              return resolve(await resp.json());
            }
            return reject({
              status: resp.status,
              error: resp.statusText,
              data: await resp.json(),
            });
          })
          .catch((err) => reject(err));
      });
    },
    [
      /* token */
    ]
  );
  const apiGet = React.useCallback(
    <R, Q = Record<string, string>>(
      path: string,
      query?: Q
      //headers?: HeadersInit
    ): Promise<R> => {
      return new Promise((resolve, reject) => {
        fetch(buildUri(path, query), {
          method: "GET",
          headers: {
            /*...(token && { Authorization: `Bearer ${token}` }),*/
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            /*   "Accept" : "/", */
            /*   "Access-Control-Allow-Origin": "*" */
            /*...(headers && { ...headers }), */
          },
        })
          .then(async (resp) => {
            if (resp.status === 200 || resp.status === 201) {
              return resolve(await resp.json());
            }
            return reject({
              status: resp.status,
              error: resp.statusText,
              data: await resp.json(),
            });
          })
          .catch((err) => reject(err));
      });
    },
    [
      /* token */
    ]
  );

  const apiDelete = React.useCallback(
    (path: string /* headers?: HeadersInit */): Promise<Response> => {
      return new Promise((resolve, reject) => {
        fetch(buildUri(path), {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then(async (resp) => {
            if (resp.ok) {
              return resolve(await resp);
            }
            return reject({
              status: resp.status,
              error: resp.statusText,
              data: await resp.json(),
            });
          })
          .catch((err) => reject(err));
      });
    },
    [
      /* token */
    ]
  );

  return {
    token,
    apiBase,
    buildUri,
    apiPost,
    noBodyApiPost,
    apiPut,
    apiPatch,
    apiGet,
    noAuthGet,
    apiDelete,
  };
};

export default useApi;
