export type ContextValue<T> = {
  value?: string | null | undefined;
  wsRequestedValue?: string | null | undefined;
  display?: T | null | undefined;
  showModal: boolean;
};

export const getInitialContextValue = <T>(
  value?: string | undefined | null,
): ContextValue<T> => ({
  display: null,
  value,
  wsRequestedValue: null,
  showModal: false,
});
