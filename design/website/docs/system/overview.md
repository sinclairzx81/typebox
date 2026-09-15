# System

System Configuration

## Overview

The System submodule contains global configurations for TypeBox. It is shared across other TypeBox submodules and is used to configure language locales, enforce immutable schematics, debug memory allocation and performance, or control general runtime characteristics of TypeBox's validation infrastructure.

## Example

The following System namespaces are available.

```typescript
import { Settings, Locale, Memory } from 'typebox/system'