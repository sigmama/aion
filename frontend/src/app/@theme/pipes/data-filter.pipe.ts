import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter',
})
export class DataFilterPipe implements PipeTransform {
  transform(array: any[], query: any): any {
    if (query) {
      return _.filter(array, (row) =>
        Object.keys(query).some((k) => {
          try {
            if (k.toString().indexOf('__') > -1) {
              const [sup, sub] = k.toString().split('__');
              if (Array.isArray(row[sup])) {
                return row[sup]
                  .map((i) => i[sub].toUpperCase())
                  .includes(((query[k] || '') + '').toUpperCase());
              } else if (
                row[sup][sub] &&
                ['string', 'number'].includes(row[sup][sub])
              ) {
                return (
                  ((row[sup][sub] || '') + '')
                    .toUpperCase()
                    .indexOf((query[k] + '' || '').toUpperCase()) > -1
                );
              }
              return false;
            } else if (
              array.length > 0 &&
              ['string', 'number'].includes(typeof row[k])
            ) {
              return (
                ((row[k] || '') + '')
                  .toUpperCase()
                  .indexOf(((query[k] || '') + '').toUpperCase()) > -1
              );
            }
            return false;
          } catch (e) {
            return false;
          }
        })
      );
    }
    return array;
  }
}
