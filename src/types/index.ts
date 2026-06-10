/**
 * Utility type: make selected keys optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type: make selected keys required.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Standard async state shape for Zustand stores.
 */
export interface AsyncState {
  loading: boolean;
  error: string | null;
}
