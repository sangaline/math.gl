import {it, expect} from 'test/utils/expect-assertions';

import { OrientedBoundingBox } from '@math.gl/culling';

it('fromRectangle sets correct default ellipsoid', function () {
  var rectangle = new Rectangle(-0.9, -1.2, 0.5, 0.7);
  var box1 = OrientedBoundingBox.fromRectangle(rectangle, 0.0, 0.0);
  var box2 = OrientedBoundingBox.fromRectangle(rectangle, 0.0, 0.0, Ellipsoid.WGS84);

  expect(box1.center).toEqualEpsilon(box2.center, CesiumMath.EPSILON15);

  expect(box1.halfAxes).toEqualEpsilon(box2.halfAxes, CesiumMath.EPSILON15);
});

it('fromRectangle sets correct default heights', () => {
  var rectangle = new Rectangle(0.0, 0.0, 0.0, 0.0);
  var box = OrientedBoundingBox.fromRectangle(rectangle, undefined, undefined, Ellipsoid.UNIT_SPHERE);

  expect(box.center).toEqualEpsilon(new Cartesian3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);

  var rotScale = Matrix3.ZERO;
  expect(box.halfAxes).toEqualEpsilon(rotScale, CesiumMath.EPSILON15);
});

it('fromRectangle throws without rectangle', () => {
  var ellipsoid = Ellipsoid.UNIT_SPHERE;
  expect(function() {
      OrientedBoundingBox.fromRectangle(undefined, 0.0, 0.0, ellipsoid);
  }).toThrowDeveloperError();
});

it('fromRectangle throws with invalid rectangles', () => {
  var ellipsoid = Ellipsoid.UNIT_SPHERE;
  expect(function() { return OrientedBoundingBox.fromRectangle(new Rectangle(-1.0, 1.0, 1.0, -1.0), 0.0, 0.0, ellipsoid); }).toThrowDeveloperError();
  expect(function() { return OrientedBoundingBox.fromRectangle(new Rectangle(-2.0, 2.0, -1.0, 1.0), 0.0, 0.0, ellipsoid); }).toThrowDeveloperError();
  expect(function() { return OrientedBoundingBox.fromRectangle(new Rectangle(-4.0, -2.0, 4.0, 1.0), 0.0, 0.0, ellipsoid); }).toThrowDeveloperError();
  expect(function() { return OrientedBoundingBox.fromRectangle(new Rectangle(-2.0, -2.0, 1.0, 2.0), 0.0, 0.0, ellipsoid); }).toThrowDeveloperError();
  expect(function() { return OrientedBoundingBox.fromRectangle(new Rectangle(-1.0, -2.0, 2.0, 2.0), 0.0, 0.0, ellipsoid); }).toThrowDeveloperError();
  expect(function() { return OrientedBoundingBox.fromRectangle(new Rectangle(-4.0, -1.0, 4.0, 2.0), 0.0, 0.0, ellipsoid); }).toThrowDeveloperError();
});

it('fromRectangle throws with non-revolution ellipsoids', () => {
  var rectangle = new Rectangle(0.0, 0.0, 0.0, 0.0);
  expect(function() { return OrientedBoundingBox.fromRectangle(rectangle, 0.0, 0.0, new Ellipsoid(1.01, 1.00, 1.01)); }).toThrowDeveloperError();
  expect(function() { return OrientedBoundingBox.fromRectangle(rectangle, 0.0, 0.0, new Ellipsoid(1.00, 1.01, 1.01)); }).toThrowDeveloperError();
});

it('fromRectangle creates an OrientedBoundingBox without a result parameter', () => {
  var ellipsoid = Ellipsoid.UNIT_SPHERE;
  var rectangle = new Rectangle(0.0, 0.0, 0.0, 0.0);
  var box = OrientedBoundingBox.fromRectangle(rectangle, 0.0, 0.0, ellipsoid);

  expect(box.center).toEqualEpsilon(new Cartesian3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);

  var rotScale = Matrix3.ZERO;
  expect(box.halfAxes).toEqualEpsilon(rotScale, CesiumMath.EPSILON15);
});

it('fromRectangle creates an OrientedBoundingBox with a result parameter', () => {
  var ellipsoid = Ellipsoid.UNIT_SPHERE;
  var rectangle = new Rectangle(0.0, 0.0, 0.0, 0.0);
  var result = new OrientedBoundingBox();
  var box = OrientedBoundingBox.fromRectangle(rectangle, 0.0, 0.0, ellipsoid, result);
  expect(box).toBe(result);

  expect(box.center).toEqualEpsilon(new Cartesian3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);

  var rotScale = Matrix3.ZERO;
  expect(box.halfAxes).toEqualEpsilon(rotScale, CesiumMath.EPSILON15);
});

it('fromRectangle for rectangles with heights', () => {
  var d90 = CesiumMath.PI_OVER_TWO;

  var box;

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, 0.0, 0.0, 0.0), 1.0, 1.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(2.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, 0.0, 0.0, 0.0), -1.0, -1.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, 0.0, 0.0, 0.0), -1.0, 1.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, 0, 1, 0, 0, 0, 0, 0, 0), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(-d90, -d90, d90, d90), 0.0, 1.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, 0, 1, 2, 0, 0, 0, 2, 0), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(-d90, -d90, d90, d90), -1.0, -1.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(-d90, -d90, d90, d90), -1.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.5, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, 0, 0.5, 1, 0, 0, 0, 1, 0), CesiumMath.EPSILON15);
});

it('fromRectangle for interesting, degenerate, and edge-case rectangles', () => {
  var d45 = CesiumMath.PI_OVER_FOUR;
  var d30 = CesiumMath.PI_OVER_SIX;
  var d90 = CesiumMath.PI_OVER_TWO;
  var d135 = 3 * CesiumMath.PI_OVER_FOUR;
  var d180 = CesiumMath.PI;
  var sqrt3 = Math.sqrt(3.0);

  var box;

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, 0.0, 0.0, 0.0), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(d180, 0.0, -d180, 0.0), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(-1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(d180, 0.0, d180, 0.0), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(-1.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, d90, 0.0, d90), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.0, 0.0, 1.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(Matrix3.ZERO, CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, 0.0, d180, 0.0), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.0, 0.5, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(-1.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(-d90, -d90, d90, d90), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.5, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(-d90, -d30, d90, d90), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.1875 * sqrt3, 0.0, 0.1875), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, -sqrt3/4, 5*sqrt3/16, 1, 0, 0, 0, 3/4, 5/16), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(-d90, -d90, d90, d30), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.1875 * sqrt3, 0.0, -0.1875), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0, sqrt3/4, 5*sqrt3/16, 1, 0, 0, 0, 3/4, -5/16), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, -d30, d180, d90), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.0, 0.1875 * sqrt3, 0.1875), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(-1, 0, 0, 0, -sqrt3/4, 5*sqrt3/16, 0, 3/4, 5/16), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, -d90, d180, d30), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.0, 0.1875 * sqrt3, -0.1875), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(-1, 0, 0, 0, sqrt3/4, 5*sqrt3/16, 0, 3/4, -5/16), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(-d45, 0.0, d45, 0.0), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3((1.0 + Math.SQRT1_2) / 2.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5 * (1.0 - Math.SQRT1_2), Math.SQRT1_2, 0.0, 0.0, 0.0, 0.0, 0.0), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(d135, 0.0, -d135, 0.0), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(-(1.0 + Math.SQRT1_2) / 2.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, -0.5 * (1.0 - Math.SQRT1_2), -Math.SQRT1_2, 0.0, 0.0, 0.0, 0.0, 0.0), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, -d45, 0.0, d45), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3((1.0 + Math.SQRT1_2) / 2.0, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5 * (1.0 - Math.SQRT1_2), 0.0, 0.0, 0.0, 0.0, Math.SQRT1_2, 0.0), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(-d90, 0.0, d90, 0.0), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.5, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0), CesiumMath.EPSILON15);

  box = OrientedBoundingBox.fromRectangle(new Rectangle(0.0, -d90, 0.0, d90), 0.0, 0.0, Ellipsoid.UNIT_SPHERE);
  expect(box.center).toEqualEpsilon(new Cartesian3(0.5, 0.0, 0.0), CesiumMath.EPSILON15);
  expect(box.halfAxes).toEqualEpsilon(new Matrix3(0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0), CesiumMath.EPSILON15);
});
