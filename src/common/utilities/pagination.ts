import { IPagination, ORDER_DIRECTION_ENUM } from "./pagination.interface";

export type SortType = {
  orderBy: string|null;
  orderDirection: ORDER_DIRECTION_ENUM;
}

export class Pagination {

  private readonly paging: boolean = false;
  private readonly size: number = 10;
  private readonly page: number = 0;
  private readonly orderBy: string = "id";
  private readonly orderDirection: ORDER_DIRECTION_ENUM = ORDER_DIRECTION_ENUM.DESC;
  private readonly orderByArray: SortType[]  = [];

  constructor(params: IPagination) {
      if (params != null) {
          this.paging = params.paging as boolean;
          this.size = params.size == null ? this.size : params.size;
          this.page = params.page == null ? this.page : params.page;

          if (params.orderBy != null && params.orderDirection != null) {
              this.orderBy = params.orderBy;
              this.orderDirection = params.orderDirection;
          }
          this.orderByArray = this.generateOrderArray();
      }
  }

  public hasPaging(): boolean {
      return this.paging;
  }

  public getSize(): number|null {
      return this.hasPaging() ? this.size : null;
  }

  public getPage(): number|null {
      return this.hasPaging() ? this.page : null;
  }

  public getOffset(): number {
      const offset = this.hasPaging() ? this.getSize() * (this.getPage()) : 0;
      return offset;
  }

  public getOrderArray() {
      return this.orderByArray;
  }

  public getOrderBy(orderBy: string|null = null) {
      return this.orderBy == null ? orderBy : this.orderBy;
  }

  public getOrderDirection() {
      return this.orderDirection;
  }

  private generateOrderArray(): SortType[] {
      if (!this.orderBy) {
          return [];
      }
      const response = [];
      const fields = this.orderBy.split(",");
      const directions = this.orderDirection.split(",");
      for (let i = 0; i < fields.length; i++) {
          const order = {orderBy: fields[i], orderDirection: directions[i]} as SortType;
          response.push(order);
      }
      return response;
  }
}