export default class Quaternion {
  constructor();
  constructor(q : Quaternion);
  constructor(q : [number, number, number, number]);
  constructor(x : number, y: number, z: number, w : number);

  rotateX(radians : number) : Quaternion;
  rotateY(radians : number) : Quaternion;
  rotateZ(radians : number) : Quaternion;
}
