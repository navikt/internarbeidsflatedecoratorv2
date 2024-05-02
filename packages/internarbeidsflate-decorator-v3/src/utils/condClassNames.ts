export function condClassNames(condition: boolean | undefined, classNames: string) {
  return condition ? classNames : '';
}