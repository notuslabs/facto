import { UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";

type QueryEvents<RespT, ErrT> = {
  onSuccess: (resp: RespT) => any;
  onError: (resp: ErrT) => any;
};

export function useQueryEvents<RespT, ErrT>(
  query: UseQueryResult<RespT, ErrT>,
  callbacks: Partial<QueryEvents<RespT, ErrT>>,
) {
  const { onSuccess, onError } = callbacks;

  useEffect(() => {
    if (query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.data, onSuccess]);

  useEffect(() => {
    if (query.error && onError) {
      onError(query.error);
    }
  }, [query.error, onError]);
}
