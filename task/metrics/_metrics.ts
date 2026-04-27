import { Task } from 'tasksmith'

export async function Metrics() {
  await Task.esbuild.metrics([
    'task/metrics/all.ts',
    'task/metrics/compile_all.ts',
    'task/metrics/schema_all.ts',
    'task/metrics/schema_check.ts',
    'task/metrics/schema_compile.ts',
    'task/metrics/schema_errors.ts',
    'task/metrics/schema_parse.ts',
    'task/metrics/type_all.ts',
    'task/metrics/type_barrel.ts',
    'task/metrics/type_builder.ts',
    'task/metrics/type_default.ts',
    'task/metrics/type_realistic_dynamic.ts',
    'task/metrics/type_realistic_compiled.ts',
    'task/metrics/type_script.ts',
    'task/metrics/value_all.ts',
    'task/metrics/value_check.ts',
    'task/metrics/value_clean.ts',
    'task/metrics/value_clone.ts',
    'task/metrics/value_convert.ts',
    'task/metrics/value_create.ts',
    'task/metrics/value_hash.ts',
    'task/metrics/value_mutate.ts',
    'task/metrics/value_pointer.ts',
    'task/metrics/value_repair.ts',
  ])
}