// extends
// infer
// 在 ts 里面，不要把 extends 简单当做一个继承关键字
interface Phone {
  band: string;
  price: number;
  color: string;

  say(): void;
}

const price: Phone["price"] = 1000;

// 有一个小灵通，他是手机，但是他没有颜色，他是黑白的
type SmallPhone = {
  band: Phone["band"];
  price: Phone["price"];

  say: Phone["say"];
};
// 观察一个细节，Phone['xxx']，其实就是对 Phone 这个interface 取值
// 一个对象取值，我们在 js for in 循环实现

// 定义一个操作类型的类型
// keyof V
// extends 不要当做继承，而是当做约束
type HeyiPick<V, K extends keyof V> = {
  // K 是经过上面一轮约束后得到的，P 只能从约束过的 'unique symbol'
  // "band" | "price" | "say"
  [P in K]: V[P];
};
// 这里的 K 是不是要在自于前面的 V 中

// Pick 的实现
// 挑选
const smallPhone1: HeyiPick<Phone, "band" | "price" | "say"> = {
  band: "小灵通",
  price: 100,
  say() {
    console.log("小灵通");
  },
};

const myNameKey = "name";
const myNameValue = "heyi";
const obj = {
  [myNameKey]: myNameValue,
};

// 在 ts 定义类型的时候，extends 大多数情况下是用来约束泛型的
// 在 面向对象编程的时候，extends 是用来实现继承的

//// infer
// 推导，智能推导
// 动态获取函数的参数类型
function test(name: string) {}

// 同学们，请用 ts 帮我 提取 出 test 函数的参数类型
// type TestParams = Parameters<test>

type Fn = (name: [string, number, Date]) => void;
const t: Fn = (name) => {};
// 正向定义可以这样，但是我们现在需要反向推导

// 1. 首先要用 infer
// 2. 然后要用 extends 约束，在这里理解为判断
// 3. 三目运算符

// 先来 检测一下 你传进来的这个函数符不符合我的约束
// 符合的话，返回对应推导出的类型，否则 返回 never
type TestParams<F> = F extends (name: infer P) => void ? P : never;
// type TestParams<F> = F extends (name: infer P) => infer R ? R : never;
// type TestParams<F> = F extends (...args: infer P) => void ? P : never;
// type TestParams<F> = F extends (name: infer P, age: infer A) => void ? P & A : never;

let f: TestParams<Fn>;
