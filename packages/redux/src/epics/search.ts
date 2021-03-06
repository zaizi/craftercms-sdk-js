import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { AnyAction, Store } from 'redux';
import { ofType } from 'redux-observable';

import { crafterConf } from '@craftercms/classes';
import { SearchService } from '@craftercms/search';
import {
  SEARCH,
  searchComplete
} from '../actions/search';
import { CrafterNamespacedState } from '@craftercms/models';

export const searchEpic =
  (action$: Observable<AnyAction>) => action$.pipe(
    ofType(SEARCH),
    mergeMap(({ payload }) =>
      SearchService.search(payload, crafterConf.getConfig())
        .pipe(
          map(response => searchComplete({
            response: response.response,
            queryId: payload.uuid
          })),
          catchError(() => Observable.of(searchComplete({
            queryId: payload.uuid
          })))
        ))
  );

export const allSearchEpics = [
  searchEpic
];
