// data.reducer.ts

import { createReducer, on } from '@ngrx/store';
import * as TodoActions from '../actions/todo.actions';
import { Todo } from '../models/todo';

export interface TodoState {
  data: Todo[];
  loading: boolean;
  error: any;
}

export const initialTodo: TodoState = {
  data: [],
  loading: false,
  error: null
};

export const todoReducer = createReducer(
  initialTodo,
  on(TodoActions.loadTodo, state => ({ ...state, loading: true, error: null })),
  on(TodoActions.loadTodoSuccess, (state, { data }) => ({ ...state, data, loading: false })),
  on(TodoActions.loadTodoFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
