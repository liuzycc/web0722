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
let ff = 123

// 下面我们移除链接上的token参数
const host = window.location.href
const url = new URL(host)
url.searchParams.delete('token')
// 重新设置链接
window.history.replaceState({}, '', url.href)

// 泛型  extends keyof typeof  inter
// 运行时类型检测 zod 可以看下

// ts泛型
const identity = <T>(arg: T): T => {
  return arg
} // 传入的类型和返回的类型一致

let output = identity<string>("myString");  // type of output will be 'string'
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);  // Array has a .length, so no more error
  return arg;
}

// 泛型接口
interface GenericIdentityFn {
  <T>(arg: T): T;
}
interface GenericIdentityFn2<T> {
  (arg: T): T;
}
// let myIdentity: <T>(arg: T) => T = identity;
// let myIdentity: GenericIdentityFn = identity;
let myIdentity: GenericIdentityFn2<number> = identity;
myIdentity(123)

// 高级类型Pick的定义
type Pick1<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface A {
  name: string;
  age: number;
  sex?: number;
}

type A1 = Pick1<A, 'name'|'age'>
// 报错：类型“"key" | "noSuchKey"”不满足约束“keyof A”
type A2 = Pick1<A, 'name'|'sex'>
const ft:A2 = {
  name:'123'
}

const aft:any = {
  name1:'111',
  age1:23
}
const {name1,age1,ft1,ddf,...arg}:Af = aft
console.log(ft1.abc)
// ts 类型拓展
interface Af {
  name1: string;
  age1: number;
  // 任意属性 解构出来的时候不会报错 并且是可选的
  [key:string]: any
}

// keyof
interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // number | "length" | "push" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string | number