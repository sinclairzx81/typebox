import { Type, Static, TSchema, TSelf, SchemaOptions } from '@sinclair/typebox'
import * as Math from './math'

export type Curve<T extends TSchema> = Static<ReturnType<typeof Curve<T>>>
export const Curve = <T extends TSchema>(schema: T) =>
  Type.Object({
    values: Type.Array(schema),
  })

export type Shape = Static<typeof Shape>
export const Shape = Type.Object({})

// ------------------------------------------------------------------------
// NoneGeometry
// ------------------------------------------------------------------------

export type NoneGeometry = Static<ReturnType<typeof NoneGeometry>>
export function NoneGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('None'),
    },
    { ...options, $id: 'NoneGeometry' },
  )
}

// ------------------------------------------------------------------------
// BoxGeometry
// ------------------------------------------------------------------------

export type BoxGeometry = Static<ReturnType<typeof BoxGeometry>>
export function BoxGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('BoxGeometry'),
      parameters: Type.Object({
        width: Type.Number(),
        height: Type.Number(),
        depth: Type.Number(),
        widthSegments: Type.Number(),
        heightSegments: Type.Number(),
        depthSegments: Type.Number(),
      }),
    },
    { ...options, $id: 'BoxGeometry' },
  )
}
// ------------------------------------------------------------------------
// CapsuleGeometry
// ------------------------------------------------------------------------

export type CapsuleGeometry = Static<ReturnType<typeof CapsuleGeometry>>
export function CapsuleGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('CapsuleGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        length: Type.Number(),
        capSegments: Type.Number(),
        radialSegments: Type.Number(),
      }),
    },
    { ...options, $id: 'CapsuleGeometry' },
  )
}

// ------------------------------------------------------------------------
// CircleGeometry
// ------------------------------------------------------------------------

export type CircleGeometry = Static<ReturnType<typeof CircleGeometry>>
export function CircleGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('CircleGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        segments: Type.Number(),
        thetaStart: Type.Number(),
        thetaLength: Type.Number(),
      }),
    },
    { ...options, $id: 'CircleGeometry' },
  )
}

// ------------------------------------------------------------------------
// ConeGeometry
// ------------------------------------------------------------------------

export type ConeGeometry = Static<ReturnType<typeof ConeGeometry>>
export function ConeGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('ConeGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        height: Type.Number(),
        radialSegments: Type.Number(),
        heightSegments: Type.Number(),
        openEnded: Type.Number(),
        thetaStart: Type.Number(),
        thetaLength: Type.Number(),
      }),
    },
    { ...options, $id: 'ConeGeometry' },
  )
}
// ------------------------------------------------------------------------
// CylinderGeometry
// ------------------------------------------------------------------------

export type CylinderGeometry = Static<ReturnType<typeof CylinderGeometry>>
export function CylinderGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('CylinderGeometry'),
      parameters: Type.Object({
        radiusTop: Type.Number(),
        radiusBottom: Type.Number(),
        height: Type.Number(),
        radialSegments: Type.Number(),
        heightSegments: Type.Number(),
        openEnded: Type.Number(),
        thetaStart: Type.Number(),
        thetaLength: Type.Number(),
      }),
    },
    { ...options, $id: 'CylinderGeometry' },
  )
}

// ------------------------------------------------------------------------
// DodecahedronGeometry
// ------------------------------------------------------------------------

export type DodecahedronGeometry = Static<ReturnType<typeof DodecahedronGeometry>>
export function DodecahedronGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('CylinderGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        detail: Type.Number(),
      }),
    },
    { ...options, $id: 'DodecahedronGeometry' },
  )
}

// ------------------------------------------------------------------------
// EdgesGeometry
// ------------------------------------------------------------------------

export type EdgesGeometry = Static<ReturnType<typeof EdgesGeometry>>
export function EdgesGeometry(geometry: TSelf, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('EdgesGeometry'),
      parameters: Type.Object({
        geometry,
      }),
    },
    { ...options, $id: 'EdgesGeometry' },
  )
}

// ------------------------------------------------------------------------
// IcosahedronGeometry
// ------------------------------------------------------------------------

export type IcosahedronGeometry = Static<ReturnType<typeof IcosahedronGeometry>>
export function IcosahedronGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('IcosahedronGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        detail: Type.Number(),
      }),
    },
    { ...options, $id: 'IcosahedronGeometry' },
  )
}

// ------------------------------------------------------------------------
// LatheGeometry
// ------------------------------------------------------------------------

export type LatheGeometry = Static<ReturnType<typeof LatheGeometry>>
export function LatheGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('LatheGeometry'),
      parameters: Type.Object({
        points: Type.Array(Math.Vector2()),
        segments: Type.Number(),
        phiStart: Type.Number(),
        phiLength: Type.Number(),
      }),
    },
    { ...options, $id: 'LatheGeometry' },
  )
}

// ------------------------------------------------------------------------
// OctahedronGeometry
// ------------------------------------------------------------------------

export type OctahedronGeometry = Static<ReturnType<typeof OctahedronGeometry>>
export function OctahedronGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('OctahedronGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        detail: Type.Number(),
      }),
    },
    { ...options, $id: 'OctahedronGeometry' },
  )
}
// ------------------------------------------------------------------------
// PlaneGeometry
// ------------------------------------------------------------------------

export type PlaneGeometry = Static<ReturnType<typeof PlaneGeometry>>
export function PlaneGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('PlaneGeometry'),
      parameters: Type.Object({
        width: Type.Number(),
        height: Type.Number(),
        widthSegments: Type.Number(),
        heightSegments: Type.Number(),
      }),
    },
    { ...options, $id: 'PlaneGeometry' },
  )
}

// ------------------------------------------------------------------------
// PolyhedronGeometry
// ------------------------------------------------------------------------

export type PolyhedronGeometry = Static<ReturnType<typeof PolyhedronGeometry>>
export function PolyhedronGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('PolyhedronGeometry'),
      parameters: Type.Object({
        vertices: Type.Array(Type.Number()),
        indices: Type.Array(Type.Number()),
        radius: Type.Number(),
        detail: Type.Number(),
      }),
    },
    { ...options, $id: 'PolyhedronGeometry' },
  )
}

// ------------------------------------------------------------------------
// RingGeometry
// ------------------------------------------------------------------------

export type RingGeometry = Static<ReturnType<typeof RingGeometry>>
export function RingGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('RingGeometry'),
      parameters: Type.Object({
        innerRadius: Type.Number(),
        outerRadius: Type.Number(),
        thetaSegments: Type.Number(),
        phiSegments: Type.Number(),
        thetaStart: Type.Number(),
        thetaLength: Type.Number(),
      }),
    },
    { ...options, $id: 'RingGeometry' },
  )
}

// ------------------------------------------------------------------------
// ShapeGeometry
// ------------------------------------------------------------------------

export type ShapeGeometry = Static<ReturnType<typeof ShapeGeometry>>
export function ShapeGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('ShapeGeometry'),
      parameters: Type.Object({
        shapes: Type.Array(Shape),
        curveSegments: Type.Number(),
      }),
    },
    { ...options, $id: 'ShapeGeometry' },
  )
}

// ------------------------------------------------------------------------
// SphereGeometry
// ------------------------------------------------------------------------

export type SphereGeometry = Static<ReturnType<typeof SphereGeometry>>
export function SphereGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('SphereGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        widthSegments: Type.Number(),
        heightSegments: Type.Number(),
        phiStart: Type.Number(),
        phiLength: Type.Number(),
        thetaStart: Type.Number(),
        thetaLength: Type.Number(),
      }),
    },
    { ...options, $id: 'SphereGeometry' },
  )
}

// ------------------------------------------------------------------------
// TetrahedronGeometry
// ------------------------------------------------------------------------

export type TetrahedronGeometry = Static<ReturnType<typeof TetrahedronGeometry>>
export function TetrahedronGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('TetrahedronGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        detail: Type.Number(),
      }),
    },
    { ...options, $id: 'TetrahedronGeometry' },
  )
}

// ------------------------------------------------------------------------
// TorusGeometry
// ------------------------------------------------------------------------

export type TorusGeometry = Static<ReturnType<typeof TorusGeometry>>
export function TorusGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('TorusGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        tube: Type.Number(),
        radialSegments: Type.Number(),
        tubularSegments: Type.Number(),
        arc: Type.Number(),
      }),
    },
    { ...options, $id: 'TorusGeometry' },
  )
}

// ------------------------------------------------------------------------
// TorusKnotGeometry
// ------------------------------------------------------------------------

export type TorusKnotGeometry = Static<ReturnType<typeof TorusKnotGeometry>>
export function TorusKnotGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('TorusKnotGeometry'),
      parameters: Type.Object({
        radius: Type.Number(),
        tube: Type.Number(),
        tubularSegments: Type.Number(),
        radialSegments: Type.Number(),
        p: Type.Number(),
        q: Type.Number(),
      }),
    },
    { ...options, $id: 'TorusKnotGeometry' },
  )
}
// ------------------------------------------------------------------------
// TubeGeometry
// ------------------------------------------------------------------------

export type TubeGeometry = Static<ReturnType<typeof TubeGeometry>>
export function TubeGeometry(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('TubeGeometry'),
      parameters: Type.Object({
        path: Curve(Math.Vector3()),
        tubularSegments: Type.Number(),
        radius: Type.Number(),
        radiusSegments: Type.Number(),
        closed: Type.Number(),
      }),
    },
    { ...options, $id: 'TubeGeometry' },
  )
}

// ------------------------------------------------------------------------
// WireframeGeometry
// ------------------------------------------------------------------------

export type WireframeGeometry = Static<ReturnType<typeof WireframeGeometry>>
export function WireframeGeometry(geometry: TSelf, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('WireframeGeometry'),
      parameters: Type.Object({
        geometry,
      }),
    },
    { ...options, $id: 'WireframeGeometry' },
  )
}
// ------------------------------------------------------------------------
// Geometry
// ------------------------------------------------------------------------

// prettier-ignore
export type Geometry = Static<ReturnType<typeof Geometry>>
export function Geometry(options: SchemaOptions = {}) {
  return Type.Recursive(
    (Geometry) =>
      Type.Union([
        NoneGeometry(),
        BoxGeometry(),
        CapsuleGeometry(),
        CircleGeometry(),
        ConeGeometry(),
        CylinderGeometry(),
        DodecahedronGeometry(),
        EdgesGeometry(Geometry),
        IcosahedronGeometry(),
        LatheGeometry(),
        OctahedronGeometry(),
        PlaneGeometry(),
        PolyhedronGeometry(),
        RingGeometry(),
        ShapeGeometry(),
        SphereGeometry(),
        TetrahedronGeometry(),
        TorusGeometry(),
        TorusKnotGeometry(),
        TubeGeometry(),
        WireframeGeometry(Geometry),
      ]),
    { $id: 'Geometry' },
  )
}
