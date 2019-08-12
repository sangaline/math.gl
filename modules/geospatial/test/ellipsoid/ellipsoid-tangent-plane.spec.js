import {it, expect} from 'test/utils/expect-assertions';

import { EllipsoidTangentPlane, Ellipsoid } from '@math.gl/geospatial';
import { Vector2, Vector3 } from 'math.gl';

const ELLIPSOID_UNIT_SPHERE = new Ellipsoid(1.0, 1.0, 1.0);
const VECTOR3_UNIT_X = new Vector3(1, 0, 0);

it('constructor defaults to WGS84', () => {
  const origin = new Vector3(Ellipsoid.WGS84.radii.x, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin);
  expect(tangentPlane.ellipsoid).toBe(Ellipsoid.WGS84);
  expect(tangentPlane.origin).toEqual(origin);
});

it('constructor sets expected values', () => {
  const tangentPlane = new EllipsoidTangentPlane(VECTOR3_UNIT_X, ELLIPSOID_UNIT_SPHERE);
  expect(tangentPlane.ellipsoid).toBe(ELLIPSOID_UNIT_SPHERE);
  expect(tangentPlane.origin).toEqual(VECTOR3_UNIT_X);
});

it('fromPoints sets expected values', () => {
  const points = [new Vector3(2.0, 0.0, 0.0), new Vector3(0.0, 0.0, 0.0)];
  const tangentPlane = EllipsoidTangentPlane.fromPoints(points, ELLIPSOID_UNIT_SPHERE);
  expect(tangentPlane.ellipsoid).toBe(ELLIPSOID_UNIT_SPHERE);
  expect(tangentPlane.origin).toEqual(VECTOR3_UNIT_X);
});

it('projectPointOntoPlane returns undefined for unsolvable projections', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);
  const positions = new Vector3(0.0, 0.0, 1.0);
  const returnedResult = tangentPlane.projectPointOntoPlane(positions);
  expect(returnedResult).toBeUndefined();
});

it('projectPointOntoPlane works without a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = new Vector3(1.0, 0.0, 1.0);
  const expectedResult = new Vector2(0.0, 1.0);
  const returnedResult = tangentPlane.projectPointOntoPlane(positions);
  expect(returnedResult).toEqual(expectedResult);
});

it('projectPointOntoPlane works with a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = new Vector3(1.0, 0.0, 1.0);
  const expectedResult = new Vector2(0.0, 1.0);
  const result = new Vector2();
  const returnedResult = tangentPlane.projectPointOntoPlane(positions, result);
  expect(result).toBe(returnedResult);
  expect(returnedResult).toEqual(expectedResult);
});

it('projectPointsOntoPlane works without a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = [new Vector3(1.0, 0.0, 1.0), new Vector3(1.0, 0.0, 0.0), new Vector3(1.0, 1.0, 0.0)];
  const expectedResults = [new Vector2(0.0, 1.0), new Vector2(0.0, 0.0), new Vector2(1.0, 0.0)];
  const returnedResults = tangentPlane.projectPointsOntoPlane(positions);
  expect(returnedResults).toEqual(expectedResults);
});

it('projectPointsOntoPlane works with a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = [new Vector3(1.0, 0.0, 1.0), new Vector3(1.0, 0.0, 0.0), new Vector3(1.0, 1.0, 0.0)];
  const expectedResults = [new Vector2(0.0, 1.0), new Vector2(0.0, 0.0), new Vector2(1.0, 0.0)];

  const index0 = new Vector2();
  const result = [index0];
  const returnedResults = tangentPlane.projectPointsOntoPlane(positions, result);
  expect(result).toBe(returnedResults);
  expect(result[0]).toBe(index0);
  expect(returnedResults).toEqual(expectedResults);
});

it('projectPointsOntoPlane works when some points cannot be projected', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = [new Vector3(1.0, 0.0, 1.0), new Vector3(1.0, 0.0, 0.0), new Vector3(0.0, 0.0, 1.0), new Vector3(1.0, 1.0, 0.0), new Vector3(0.0, 1.0, 0.0)];
  const expectedResults = [new Vector2(0.0, 1.0), new Vector2(0.0, 0.0), new Vector2(1.0, 0.0)];
  const returnedResults = tangentPlane.projectPointsOntoPlane(positions);
  expect(returnedResults).toEqual(expectedResults);
});

it('projectPointOntoEllipsoid works without a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const position = new Vector3(2.0, 2.0, 0.0);
  const expectedResult = new Vector3(1.0/3.0, 2.0/3.0,  2.0/3.0);
  const returnedResult = tangentPlane.projectPointOntoEllipsoid(position);
  expect(returnedResult).toEqual(expectedResult);
});

it('projectPointOntoEllipsoid works with a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const position = new Vector3(2.0, -2.0, 0.0);
  const expectedResult = new Vector3(1.0/3.0, 2.0/3.0, -2.0/3.0);
  const result = new Vector3();
  const returnedResult = tangentPlane.projectPointOntoEllipsoid(position, result);
  expect(result).toBe(returnedResult);
  expect(returnedResult).toEqual(expectedResult);
});

it('projectPointsOntoEllipsoid works without a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = [new Vector3(2.0, -2.0, 0.0), new Vector3(2.0, 2.0, 0.0)];
  const expectedResults = [new Vector3(1.0/3.0, 2.0/3.0, -2.0/3.0), new Vector3(1.0/3.0, 2.0/3.0,  2.0/3.0)];
  const returnedResults = tangentPlane.projectPointsOntoEllipsoid(positions);
  expect(returnedResults).toEqual(expectedResults);
});

it('projectPointsOntoEllipsoid works with a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = [new Vector3(2.0, -2.0, 0.0), new Vector3(2.0, 2.0, 0.0)];
  const expectedResults = [new Vector3(1.0/3.0, 2.0/3.0, -2.0/3.0), new Vector3(1.0/3.0, 2.0/3.0,  2.0/3.0)];
  const index0 = new Vector3();
  const result = [index0];
  const returnedResults = tangentPlane.projectPointsOntoEllipsoid(positions, result);
  expect(result).toBe(returnedResults);
  expect(result[0]).toBe(index0);
  expect(returnedResults).toEqual(expectedResults);
});

it('projectPointToNearestOnPlane works without a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = new Vector3(1.0, 0.0, 1.0);
  const expectedResult = new Vector2(0.0, 1.0);
  const returnedResult = tangentPlane.projectPointToNearestOnPlane(positions);
  expect(returnedResult).toEqual(expectedResult);
});

it('projectPointToNearestOnPlane works projecting from constious distances', () => {
  const ellipsoid = Ellipsoid.ZERO;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  expect(tangentPlane.projectPointToNearestOnPlane(new Vector3(2.0, 0.0, 0.0))).toEqual(new Vector2(0.0, 0.0));
  expect(tangentPlane.projectPointToNearestOnPlane(new Vector3(1.0, 0.0, 0.0))).toEqual(new Vector2(0.0, 0.0));
  expect(tangentPlane.projectPointToNearestOnPlane(new Vector3(0.0, 0.0, 0.0))).toEqual(new Vector2(0.0, 0.0));
  expect(tangentPlane.projectPointToNearestOnPlane(new Vector3(-1.0, 0.0, 0.0))).toEqual(new Vector2(0.0, 0.0));
});

it('projectPointToNearestOnPlane works with a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = new Vector3(1.0, 0.0, 1.0);
  const expectedResult = new Vector2(0.0, 1.0);
  const result = new Vector2();
  const returnedResult = tangentPlane.projectPointToNearestOnPlane(positions, result);
  expect(result).toBe(returnedResult);
  expect(returnedResult).toEqual(expectedResult);
});

it('projectPointsToNearestOnPlane works without a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = [new Vector3(1.0, 0.0, 1.0), new Vector3(1.0, 0.0, 0.0), new Vector3(1.0, 1.0, 0.0)];
  const expectedResults = [new Vector2(0.0, 1.0), new Vector2(0.0, 0.0), new Vector2(1.0, 0.0)];
  const returnedResults = tangentPlane.projectPointsToNearestOnPlane(positions);
  expect(returnedResults).toEqual(expectedResults);
});

it('projectPointsToNearestOnPlane works with a result parameter', () => {
  const ellipsoid = ELLIPSOID_UNIT_SPHERE;
  const origin = new Vector3(1.0, 0.0, 0.0);
  const tangentPlane = new EllipsoidTangentPlane(origin, ellipsoid);

  const positions = [new Vector3(1.0, 0.0, 1.0), new Vector3(1.0, 0.0, 0.0), new Vector3(1.0, 1.0, 0.0)];
  const expectedResults = [new Vector2(0.0, 1.0), new Vector2(0.0, 0.0), new Vector2(1.0, 0.0)];

  const index0 = new Vector2();
  const result = [index0];
  const returnedResults = tangentPlane.projectPointsToNearestOnPlane(positions, result);
  expect(result).toBe(returnedResults);
  expect(result[0]).toBe(index0);
  expect(returnedResults).toEqual(expectedResults);
});

it('constructor throws without origin', () => {
  expect(() => new EllipsoidTangentPlane(undefined, Ellipsoid.WGS84)).toThrowDeveloperError();
});

it('constructor throws if origin is at the center of the ellipsoid', () => {
  expect(() => new EllipsoidTangentPlane(Vector3.ZERO, Ellipsoid.WGS84)).toThrowDeveloperError();
});

it('fromPoints throws without cartesians', () => {
  expect(() => EllipsoidTangentPlane.fromPoints(undefined, Ellipsoid.WGS84)).toThrowDeveloperError();
});

it('projectPointOntoPlane throws without cartesian', () => {
  const tangentPlane = new EllipsoidTangentPlane(VECTOR3_UNIT_X, ELLIPSOID_UNIT_SPHERE);
  expect(() => tangentPlane.projectPointOntoPlane(undefined)).toThrowDeveloperError();
});

it('projectPointsOntoPlane throws without cartesians', () => {
  const tangentPlane = new EllipsoidTangentPlane(VECTOR3_UNIT_X, ELLIPSOID_UNIT_SPHERE);
  expect(() => tangentPlane.projectPointsOntoPlane(undefined)).toThrowDeveloperError();
});

it('projectPointToNearestOnPlane throws without cartesian', () => {
  const tangentPlane = new EllipsoidTangentPlane(VECTOR3_UNIT_X, ELLIPSOID_UNIT_SPHERE);
  expect(() => tangentPlane.projectPointToNearestOnPlane(undefined)).toThrowDeveloperError();
});

it('projectPointsToNearestOnPlane throws without cartesians', () => {
  const tangentPlane = new EllipsoidTangentPlane(VECTOR3_UNIT_X, ELLIPSOID_UNIT_SPHERE);
  expect(() => tangentPlane.projectPointsToNearestOnPlane(undefined)).toThrowDeveloperError();
});

it('projectPointsOntoEllipsoid throws without cartesians', () => {
  const tangentPlane = new EllipsoidTangentPlane(VECTOR3_UNIT_X, ELLIPSOID_UNIT_SPHERE);
  expect(() => tangentPlane.projectPointsOntoEllipsoid(undefined)).toThrowDeveloperError();
});

it('projectPointsOntoEllipsoid works with an arbitrary ellipsoid using fromPoints', () => {
  const points = Vector3.fromDegreesArray([
      -72.0, 40.0,
      -68.0, 35.0,
      -75.0, 30.0,
      -70.0, 30.0,
      -68.0, 40.0
  ]);

  const tangentPlane = EllipsoidTangentPlane.fromPoints(points, Ellipsoid.WGS84);
  const points2D = tangentPlane.projectPointsOntoPlane(points);
  const positionsBack = tangentPlane.projectPointsOntoEllipsoid(points2D);

  expect(positionsBack[0].x).toBeCloseTo(points[0].x);
  expect(positionsBack[0].y).toBeCloseTo(points[0].y);
  expect(positionsBack[0].z).toBeCloseTo(points[0].z);
});
