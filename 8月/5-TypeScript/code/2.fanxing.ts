// 泛型也是一种抽象，在定义时某些数据类型不确定，而是在使用时给定
// 泛型的定义使用<>包裹，<>中放入一个标识符，用于表示当前泛型
const stringArr: Array<string> = ["a", "b", "c"];
const strArr: string[] = ["a", "b", "c"];

// 当下的定义完全丧失了灵活性，因为有些属性他是动态类型，我们在定义之初是不可以完全限定死的
interface Student<T> {
  name: string;
  age: T;

  sayAge(): T;
}

const student: Student<string> = {
  name: "Heyi",
  age: "18",

  sayAge() {
    return "18";
  },
};

// 方法重载

// 队列，我们的队列中存放的数据多变，可以是 string 、number、boolean
// 这里的 T、U、V 就是泛型变量，用于表示当前泛型的类型，类似于函数的形参
interface Queue<V, K = number> {
  // queue: V[];
  map: Map<K, V>;
}

const queue: Queue<string> = {
  // queue: ["a", "b", "c"],
  map: new Map<number, string>([]),
};
