declare module '*.css' {}

declare module 'prismjs' {
  const Prism: {
    highlightAllUnder(container: ParentNode): void
  }
  export default Prism
}
