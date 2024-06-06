import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class PaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = '每頁筆數';
  override firstPageLabel = '第一頁';
  override nextPageLabel = '下一頁';
  override previousPageLabel = '上一頁';
  override lastPageLabel = '最後一頁';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 - 0，共 0 筆`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex}，共 ${length} 筆`;
  };
}
