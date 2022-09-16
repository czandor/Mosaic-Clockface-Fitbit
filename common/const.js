import { me as device } from "device";
import * as util from "../common/utils";
util.setDevice(device);

import * as sense from "../common/const.sense";
import * as def from "../common/const.def";

export const corners = (device.sense)?sense.corners:def.corners;
export const drawSize = (device.sense)?sense.drawSize:def.drawSize;

export const APP_LOG=0;


export const ledRows=20;
export const ledChangeNum=9; //max 9
export const MosaicStateBlack=0;
export const MosaicStateColor=1;
export const MosaicStateToBlack=2;
export const MosaicStateToColor=3;

export const DataNone=0;
export const DataBatt=1;
export const DataHR=2;
export const DataSteps=3;
export const DataDist=4;
export const DataAZM=5;
export const DataCals=6;
export const DataFloors=7;
export const DataMax=8;

export const MONTHNAMES_DEFAULT= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const WEEKDAYS_DEFAULT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const matrixRows=7; //7 bit in matrixNums
/*export const matrixNums=[
  [0x3E, 0x51, 0x49, 0x45, 0x3E], // 0x30 0
  [0x00, 0x42, 0x7F, 0x40, 0x00], // 0x31 1
  [0x72, 0x49, 0x49, 0x49, 0x46], // 0x32 2
  [0x21, 0x41, 0x49, 0x4D, 0x33], // 0x33 3
  [0x18, 0x14, 0x12, 0x7F, 0x10], // 0x34 4
  [0x27, 0x45, 0x45, 0x45, 0x39], // 0x35 5
  [0x3C, 0x4A, 0x49, 0x49, 0x31], // 0x36 6
  [0x41, 0x21, 0x11, 0x09, 0x07], // 0x37 7
  [0x36, 0x49, 0x49, 0x49, 0x36], // 0x38 8
  [0x46, 0x49, 0x49, 0x29, 0x1E], // 0x39 9
];*/
/*export const matrixNums=[
  [0b, 0b, 0b, 0b, 0b], // 0x30 0
  [0b, 0b, 0b, 0b, 0b], // 0x31 1
  [0b, 0b, 0b, 0b, 0b], // 0x32 2
  [0b, 0b, 0b, 0b, 0b], // 0x33 3
  [0b, 0b, 0b, 0b, 0b], // 0x34 4
  [0b, 0b, 0b, 0b, 0b], // 0x35 5
  [0b, 0b, 0b, 0b, 0b], // 0x36 6
  [0b, 0b, 0b, 0b, 0b], // 0x37 7
  [0b, 0b, 0b, 0b, 0b], // 0x38 8
  [0b, 0b, 0b, 0b, 0b], // 0x39 9
];*/
/*export const matrixNums=[
  [0b0111110, 0b1000001, 0b1000001, 0b1000001, 0b0111110], // 0x30 0
  [0b0000000, 0b1000001, 0b1111111, 0b1000000, 0b0000000], // 0x31 1
  [0b1100010, 0b1010001, 0b1001001, 0b1001001, 0b1000110], // 0x32 2
  [0b0100010, 0b1000001, 0b1001001, 0b1001001, 0b0110110], // 0x33 3
  [0b0001111, 0b0001000, 0b0001000, 0b0001000, 0b1111111], // 0x34 4
  [0b0101111, 0b1001001, 0b1001001, 0b1001001, 0b0110001], // 0x35 5
  [0b0111110, 0b1001001, 0b1001001, 0b1001001, 0b0110010], // 0x36 6
  [0b0000001, 0b1110001, 0b0001001, 0b0000101, 0b0000011], // 0x37 7
  [0b0110110, 0b1001001, 0b1001001, 0b1001001, 0b0110110], // 0x38 8
  [0b0100110, 0b1001001, 0b1001001, 0b1001001, 0b0111110], // 0x39 9
];*/
/*export const matrixNums=[
  [0b0111110, 0b1010001, 0b1001001, 0b1000101, 0b0111110], // 0x30 0
  [0b0000000, 0b1000010, 0b1111111, 0b1000000, 0b0000000], // 0x31 1
  [0b1000010, 0b1100001, 0b1010001, 0b1001001, 0b1000110], // 0x32 2
  [0b1000001, 0b1001001, 0b1001001, 0b1001001, 0b0110110], // 0x33 3
  [0b0001111, 0b0001000, 0b0001000, 0b0001000, 0b1111111], // 0x34 4
  [0b1001111, 0b1001001, 0b1001001, 0b1001001, 0b0110001], // 0x35 5
  [0b0111110, 0b1001001, 0b1001001, 0b1001001, 0b0110000], // 0x36 6
  [0b0000001, 0b0000001, 0b1110001, 0b0001001, 0b0000111], // 0x37 7
  [0b0110110, 0b1001001, 0b1001001, 0b1001001, 0b0110110], // 0x38 8
  [0b0100110, 0b1001001, 0b1001001, 0b1001001, 0b0111110], // 0x39 9
];*/

export const matrixNums=[
  [0b0111110, 0b1111111, 0b1000001, 0b1111111, 0b0111110], // 0x30 0
  [0b1000010, 0b1111111, 0b1111111, 0b1000000], // 0x31 1
  [0b1100010, 0b1110011, 0b1011001, 0b1001111, 0b1000110], // 0x32 2
  [0b0100010, 0b1100011, 0b1001001, 0b1111111, 0b0110110], // 0x33 3
  //[0b0001100, 0b0001110, 0b0001011, 0b1111111, 0b1111111], // 0x34 4
  [0b0001100, 0b0001110, 0b0001011, 0b1111111, 0b1111111, 0b0001000], // 0x34 4
  [0b0100111, 0b1100111, 0b1000101, 0b1111101, 0b0111001], // 0x35 5
  [0b0111110, 0b1111111, 0b1000101, 0b1111101, 0b0111000], // 0x36 6
  [0b1100001, 0b1110001, 0b0011001, 0b0001111, 0b0000111], // 0x37 7
  [0b0110110, 0b1111111, 0b1001001, 0b1111111, 0b0110110], // 0x38 8
  [0b0001110, 0b1011111, 0b1010001, 0b1111111, 0b0111110], // 0x39 9
];