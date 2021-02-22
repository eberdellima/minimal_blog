
export interface IPagination {
  paging: boolean;
  size: number | null;
  page: number | null;
  orderBy: string | null;
  orderDirection: ORDER_DIRECTION_ENUM | null;
}

export enum ORDER_DIRECTION_ENUM {
  "DESC" = "DESC",
  "ASC" = "ASC"
}

export interface IPaginationDTO {
  size: number | null;
  offset: number | null;
  orderBy: string | null;
  orderDirection: ORDER_DIRECTION_ENUM | null;
}