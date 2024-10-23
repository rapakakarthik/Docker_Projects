// data.actions.ts

import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo';

export const loadTodo = createAction('[Todo] Load Todo');
export const loadTodoSuccess = createAction('[Todo] Load Todo Success', props<{ data: Todo[] }>());
export const loadTodoFailure = createAction('[Todo] Load Todo Failure', props<{ error: any }>());