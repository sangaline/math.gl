import {it, expect} from 'test/utils/expect-assertions';

import { OrientedBoundingBox, makeBoundingBoxFromRectangle } from '@math.gl/culling';
import { Ellipsoid } from '@math.gl/geospatial';

const ELLIPSOID_UNIT_SPHERE = new Ellipsoid(1, 1, 1);

it('fromRectangle sets correct default ellipsoid', () => {
  const rectangle = new Rectangle(-0.9, -1.2, 0.5, 0.7);
  const box1 = makeBoundingBoxFromRectangle(rectangle, 0.0, 0.0);
  const box2 = makeBoundingBoxFromRectangle(rectangle, 0.0, 0.0, Ellipsoid.WGS84);

  expect(box1.center).toEqualEpsilon(box2.center, CesiumMath.EPSILON15);
  expect(box1.halfAxes).toEqualEpsilon(box2.halfAxes, CesiumMath.EPSILON15);
});

it('fromRectangle sets correct default heights', () => {
  const rectangle = new Rectangle(0.0, 0.0, 0.0, 0.0);
  const box = makeBoundingBoxFromRectangle(rectangle, undefined, undefined, ELLIPSOID_UNIT_SPHERE);

  expect(box.center).toEqualEpsilon(new Vector3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);

  const rotScale = Matrix3.ZERO;
  expect(box.halfAxes).toEqualEpsilon(rotScale, CesiumMath.EPSILON15);
});

it('fromRectangle throws without rectangle', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  expect(() => makeBoundingBoxFromRectangle(undefined, 0.0, 0.0, ellipsoid)).toThrowError();
});

it('fromRectangle throws with invalid rectangles', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  expect(() => makeBoundingBoxFromRectangle(new Rectangle(-1.0, 1.0, 1.0, -1.0), 0.0, 0.0, ellipsoid)).toThrowError();
  expect(() => makeBoundingBoxFromRectangle(new Rectangle(-2.0, 2.0, -1.0, 1.0), 0.0, 0.0, ellipsoid)).toThrowError();
  expect(() => makeBoundingBoxFromRectangle(new Rectangle(-4.0, -2.0, 4.0, 1.0), 0.0, 0.0, ellipsoid)).toThrowError();
  expect(() => makeBoundingBoxFromRectangle(new Rectangle(-2.0, -2.0, 1.0, 2.0), 0.0, 0.0, ellipsoid)).toThrowError();
  expect(() => makeBoundingBoxFromRectangle(new Rectangle(-1.0, -2.0, 2.0, 2.0), 0.0, 0.0, ellipsoid)).toThrowError();
  expect(() => makeBoundingBoxFromRectangle(new Rectangle(-4.0, -1.0, 4.0, 2.0), 0.0, 0.0, ellipsoid)).toThrowError();
});

it('fromRectangle throws with non-revolution ellipsoids', () => {
  const rectangle = new Rectangle(0.0, 0.0, 0.0, 0.0);
  expect(() => makeBoundingBoxFromRectangle(rectangle, 0.0, 0.0, new Ellipsoid(1.01, 1.00, 1.01))).toThrowError();
  expect(() => makeBoundingBoxFromRectangle(rectangle, 0.0, 0.0, new Ellipsoid(1.00, 1.01, 1.01))).toThrowError();
});

it('fromRectangle creates an OrientedBoundingBox without a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const rectangle = new Rectangle(0.0, 0.0, 0.0, 0.0);
  const box = makeBoundingBoxFromRectangle(rectangle, 0.0, 0.0, ellipsoid);

  expect(box.center).toEqualEpsilon(new Vector3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);

  const rotScale = Matrix3.ZERO;
  expect(box.halfAxes).toEqualEpsilon(rotScale, CesiumMath.EPSILON15);
});

it('fromRectangle creates an OrientedBoundingBox with a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const rectangle = new Rectangle(0.0, 0.0, 0.0, 0.0);
  const result = new OrientedBoundingBox();
  const box = makeBoundingBoxFromRectangle(rectangle, 0.0, 0.0, ellipsoid, result);
  expect(box).toBe(result);

  expect(box.center).toEqualEpsilon(new Vector3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);

  const rotScale = Matrix3.ZERO;
  expect(box.halfAxes).toEqualEpsilon(rotScale, CesiumMath.EPSILON15);
});

it('fromRectangle for rectangles with heights', () => {
  const d90 = CesiumMath.PI_OVER_TWO;

  const box;

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, 0.0, 0.0, 0.0), 1.0, 1.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(2.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, 0.0, 0.0, 0.0), -1.0, -1.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, 0.0, 0.0, 0.0), -1.0, 1.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, 0, 1, 0, 0, 0, 0, 0, 0), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(-d90, -d90, d90, d90), 0.0, 1.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, 0, 1, 2, 0, 0, 0, 2, 0), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(-d90, -d90, d90, d90), -1.0, -1.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(-d90, -d90, d90, d90), -1.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.5, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, 0, 0.5, 1, 0, 0, 0, 1, 0), CesiumMath.EPSILON15);
});

it('fromRectangle for interesting, degenerate, and edge-case rectangles', () => {
  const d45 = CesiumMath.PI_OVER_FOUR;
  const d30 = CesiumMath.PI_OVER_SIX;
  const d90 = CesiumMath.PI_OVER_TWO;
  const d135 = 3 * CesiumMath.PI_OVER_FOUR;
  const d180 = CesiumMath.PI;
  const sqrt3 = Math.sqrt(3.0);

  const box;

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, 0.0, 0.0, 0.0), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(d180, 0.0, -d180, 0.0), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(-1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(d180, 0.0, d180, 0.0), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(-1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, d90, 0.0, d90), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.0, 0.0, 1.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, 0.0, d180, 0.0), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.0, 0.5, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(-1.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(-d90, -d90, d90, d90), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.5, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(-d90, -d30, d90, d90), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.1875 * sqrt3, 0.0, 0.1875), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, -sqrt3/4, 5*sqrt3/16, 1, 0, 0, 0, 3/4, 5/16), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(-d90, -d90, d90, d30), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.1875 * sqrt3, 0.0, -0.1875), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, sqrt3/4, 5*sqrt3/16, 1, 0, 0, 0, 3/4, -5/16), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, -d30, d180, d90), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.0, 0.1875 * sqrt3, 0.1875), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(-1, 0, 0, 0, -sqrt3/4, 5*sqrt3/16, 0, 3/4, 5/16), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, -d90, d180, d30), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.0, 0.1875 * sqrt3, -0.1875), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(-1, 0, 0, 0, sqrt3/4, 5*sqrt3/16, 0, 3/4, -5/16), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(-d45, 0.0, d45, 0.0), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3((1.0 + Math.SQRT1_2) / 2.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5 * (1.0 - Math.SQRT1_2), Math.SQRT1_2, 0.0, 0.0, 0.0, 0.0, 0.0), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(d135, 0.0, -d135, 0.0), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(-(1.0 + Math.SQRT1_2) / 2.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, -0.5 * (1.0 - Math.SQRT1_2), -Math.SQRT1_2, 0.0, 0.0, 0.0, 0.0, 0.0), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, -d45, 0.0, d45), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3((1.0 + Math.SQRT1_2) / 2.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5 * (1.0 - Math.SQRT1_2), 0.0, 0.0, 0.0, 0.0, Math.SQRT1_2, 0.0), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(-d90, 0.0, d90, 0.0), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.5, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0), CesiumMath.EPSILON15);

  box = makeBoundingBoxFromRectangle(new Rectangle(0.0, -d90, 0.0, d90), 0.0, 0.0, ELLIPSOID_UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Vector3(0.5, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0), CesiumMath.EPSILON15);
});
