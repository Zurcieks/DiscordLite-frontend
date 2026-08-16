export type ApiError = {
  status: number;
  title: string;
  detail: string;
  code?: string;
  traceId?: string;
};
