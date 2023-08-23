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
// 

