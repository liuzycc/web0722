/**
 *  - string
    - number
    - boolean
    - symbol
    - undefined
    - null（type of null === object）

    - function
    - object
      - Date
      - RegExp
      - Array
 */
let a: string = "1"; // string
const b: number = 2; // number
const c: boolean = true; // boolean

const date: Date = new Date(); // Date
// Array 当做一个桶，桶里面装什么东西不知道，不知道你就要用 泛型
const arr: Array<number | string> = [1, "2", 3];

// 我们很多时候，类型是需要进行一些拓展的，我既想要是 number，有想要是 string
// Element UI， Button 组件，size，有时候是一个数字，有时候是一个给定好的值
//// 类型联合
const size: number | "small" | "large" = "small";

// 但是通常我们会给这种联合好的类型定一个别名，
type Size = number | "small" | "large";
let buttonSize: Size = "large";
// 联合类型，通常将几个小类型组合成一个大类型，你要针对小类型再去处理呢？
// 就需要用到策略模式 + 类型守卫
// 标准类型守卫写法
function isNumberType(size: Size): size is number {
  return typeof size === "number";
}

//// 交叉类型
// 接口，就是针对对象的进一步抽象
class Heyi {
  name: string = "Heyi";
  hobby: string = "coding";

  say() {
    console.log("Heyi");
  }
}
// 进一步抽象
interface Teacher {
  name: string;
  // 可选参数
  bobby?: string;

  say(): void;
}

// 实现这个抽象，抽象约束
class Heyii implements Teacher {
  name: string = "Heyii";
  bobby: string = "coding";

  say() {
    console.log("Heyii");
  }
}

// 定义一个场景
// 画布里面，有很多的图形，圆形，矩形，三角形，椭圆，正方形
// 形状是一个抽象
// 位置是一个抽象
// 颜色是一个抽象
interface Shape {
  shape: string;
}
interface Position {
  x: number;
  y: number;
}
interface Color {
  color: string;
}

// 组合起来的
type Circle = Shape & Position & Color;
// 继承是可以实现属性和方法的复用，但是无法约束类型
const circle: Circle = {
  shape: "circle",
  x: 1,
  y: 2,
  color: "red",
};

// 交叉和联合类型的区别？
// 交叉类型，主要针对对象，是将多个类型合并成一个类型，包含了所有类型的特性
// 联合类型，是将多个类型合并成一个类型，只能使用共有的特性

// type 和 interface 的区别
interface Person {
  name: string;
}
