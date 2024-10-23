// data.selectors.ts

import { createSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

export const selectTodoState = (state: any) => state.todo;

export const selectTodo = createSelector(
  selectTodoState,
  (state: TodoState) => state.data
);

export const selectLoading = createSelector(
  selectTodoState,
  (state: TodoState) => state.loading
);

export const selectError = createSelector(
  selectTodoState,
  (state: TodoState) => state.error
);
