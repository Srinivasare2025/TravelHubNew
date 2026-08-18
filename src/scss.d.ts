/**
 * SPFx's own gulp "sass" subtask generates a `X.module.scss.ts` sibling next
 * to every `X.module.scss` at build time, which is what actually lets
 * `import styles from './X.module.scss'` resolve when you run `gulp serve`/
 * `gulp bundle`. This ambient declaration exists so `tsc --noEmit` (CI, a
 * pre-commit hook, your editor) also type-checks cleanly without needing a
 * full gulp run first — it has no effect on the real build output.
 */
declare module '*.module.scss' {
  const classes: { [className: string]: string };
  export default classes;
}
