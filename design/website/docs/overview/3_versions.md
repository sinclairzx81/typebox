# Versions

TypeBox provides two distinct versions, spanning two generations of the TypeScript compiler.

### Version 0.x

```bash
$ npm install @sinclair/typebox                     # 0.x - LTS    | TS 4-6
```

Developed against TypeScript 4-6 and maintained under Long Term Support (LTS) for existing infrastructure on the 0.x revision line. ESM and CJS compatible.

### Version 1.x

```bash
$ npm install typebox                               # 1.x - Latest | TS 7 Native
```

Developed against the TypeScript 7 native compiler with advanced type inference and JSON Schema 2020-12 compliant validation, with backwards compatibility for `0.x` types. ESM only.

### Additional

The `1.x` version is recommended for most new projects and is the active development line that targets optimizations enabled by the TypeScript 7 native compiler. The `0.x` version is maintained under LTS for environments requiring CJS and ESM compatibility as well as support for older TypeScript compiler versions. For issues relating to `0.x` please submit them to the [TypeBox 0.x](https://github.com/sinclairzx81/sinclair-typebox) repository.