// data.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CrudService } from '../services/crud.service';
import { Todo } from '../models/todo';
import * as TodoActions from '../actions/todo.actions';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions, private crud: CrudService) {}

  loadTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodo),
      mergeMap(
        () =>
        this.crud.getTodos().pipe(
          map((data: Todo[]) => TodoActions.loadTodoSuccess({ data })),
          catchError((error: any) => of(TodoActions.loadTodoFailure({ error })))
        )
      )
    )
  );
}
