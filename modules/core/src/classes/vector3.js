// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import Vector from '../lib/vector';
import {config, isArray} from '../lib/common';
import {checkNumber} from '../lib/validators';

import * as vec3 from 'gl-matrix/vec3';

const ORIGIN = [0, 0, 0];

export default class Vector3 extends Vector {
  constructor(x = 0, y = 0, z = 0) {
    // PERF NOTE: initialize elements as double precision numbers
    super(-0, -0, -0);
    if (isArray(x) && arguments.length === 1) {
      this.copy(x);
    } else {
      // this.set(x, y, z);
      if (config.debug) {
        checkNumber(x);
        checkNumber(y);
        checkNumber(z);
      }
      this[0] = x;
      this[1] = y;
      this[2] = z;
    }
  }

  fromObject(object) {
    if (config.debug) {
      checkNumber(object.x);
      checkNumber(object.y);
      checkNumber(object.z);
    }
    this[0] = object.x;
    this[1] = object.y;
    this[2] = object.z;
    return this;
  }

  toObject(object) {
    object.x = this[0];
    object.y = this[1];
    object.z = this[2];
    return object;
  }

  // Getters/setters
  /* eslint-disable no-multi-spaces, brace-style, no-return-assign */
  get ELEMENTS() {
    return 3;
  }

  // x,y inherited from Vector

  get z() {
    return this[2];
  }
  set z(value) {
    return (this[2] = checkNumber(value));
  }
  /* eslint-enable no-multi-spaces, brace-style, no-return-assign */

  angle(vector) {
    return vec3.angle(this, vector);
  }

  // MODIFIERS

  cross(vector) {
    vec3.cross(this, this, vector);
    return this.check();
  }

  rotateX({radians, origin = ORIGIN}) {
    vec3.rotateX(this, this, origin, radians);
    return this.check();
  }

  rotateY({radians, origin = ORIGIN}) {
    vec3.rotateY(this, this, origin, radians);
    return this.check();
  }

  rotateZ({radians, origin = ORIGIN}) {
    vec3.rotateZ(this, this, origin, radians);
    return this.check();
  }

  operation(operation, ...args) {
    operation(this, this, ...args);
    return this.check();
  }
}