import { Task } from 'tasksmith'

export async function Metrics() {
  await Task.esbuild.metrics([
    'task/metrics/all.ts',
    'task/metrics/compile-all.ts',
    'task/metrics/schema-all.ts',
    'task/metrics/schema-build.ts',
    'task/metrics/schema-check.ts',
    'task/metrics/schema-errors.ts',
    'task/metrics/type-all.ts',
    'task/metrics/type-barrel.ts',
    'task/metrics/type-builder.ts',
    'task/metrics/type-default.ts',
    'task/metrics/type-realistic.ts',
    'task/metrics/type-script.ts',
    'task/metrics/value-all.ts',
    'task/metrics/value-check.ts',
    'task/metrics/value-clean.ts',
    'task/metrics/value-clone.ts',
    'task/metrics/value-convert.ts',
    'task/metrics/value-create.ts',
    'task/metrics/value-hash.ts',
    'task/metrics/value-pointer.ts',
  ])
}