/**
 *
 *                    LISP                      C
 *
 *   2 + 2          (add 2 2)                 add(2, 2)
 *   4 - 2          (subtract 4 2)            subtract(4, 2)
 *   2 + (4 - 2)    (add 2 (subtract 4 2))    add(2, subtract(4, 2))
 *
 *
 */
/**
 * 大部分编译器的工作可以被分解为三个主要阶段：解析（Parsing），转化（Transformation）以及
 * 代码生成（Code Generation）。
 *
 * 1. *解析* 将源代码转换为一个更抽象的形式。
 *
 * 2. *转换* 接受解析产生的抽象形式并且操纵这些抽象形式做任何编译器想让它们做的事。
 *
 * 3. *代码生成* 基于转换后的代码表现形式（code representation）生成目标代码。
 */

/**
 * 解析
 * -------
 *
 * 解析一般被分为两个部分：词法分析和语法分析。
 *
 * 1. *词法分析* 通过一个叫做tokenizer（词素生成器，也叫lexer）的工具将源代码分解成一个个词素。
 *
 *    词素是描述编程语言语法的对象。它可以描述数字，标识符，标点符号，运算符等等。
 *
 * 2. *语法分析* 接收词素并将它们组合成一个描述了源代码各部分之间关系的中间表达形式：抽象语法树。
 *
 *    抽象语法树是一个深度嵌套的对象，这个对象以一种既能够简单地操作又提供很多关于源代码信息的形式
 *    来展现代码。
 *
 * 看下面的代码:
 *
 *   (add 2 (subtract 4 2))
 *
 * 上面代码产生的词素会像下面这样：
 *
 *   [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        },
 *   ]
 *
 * 而产生的抽象语法树会像下面这样：
 *
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2',
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4',
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2',
 *         }]
 *       }]
 *     }]
 *   }
 */

// 转换 ast -> newAst 语法树转对应语言的语法树   uniapp -> 微信小程序 uniaoo -> 支付宝小程序
// 生成 newAst -> output 递归遍历 join('')

// 词素生成器
function tokenizer(input) {
  let current = 0;

  let tokens = [];

  while (current < input.length) {
    let char = input[current];

    if (char === "(") {
      tokens.push({
        type: "paren",
        value: "(",
      });

      current++;

      continue;
    }

    if (char === ")") {
      tokens.push({
        type: "paren",
        value: ")",
      });
      current++;
      continue;
    }

    // 空格过滤
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    // 检索所有数字
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";

      while (NUMBERS.test(char)) {
        value += char;
        // next number
        char = input[++current];
      }

      tokens.push({ type: "number", value });

      continue;
    }
    // 检索所有字符串
    if (char === '"') {
      let value = "";

      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      char = input[++current];

      tokens.push({ type: "string", value });

      continue;
    }
    // 检索所有字母 function name
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = "";

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: "name", value });

      continue;
    }
    // 没有类型异常抛出
    throw new TypeError("I dont know what this character is: " + char);
  }

  return tokens;
}

// 语法分析器接受我们的词素数组并创造出一个抽象语法树。
function parser(tokens) {
  // 光标位置
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === "number") {
      current++;

      return {
        type: "NumberLiteral",
        value: token.value,
      };
    }

    if (token.type === "string") {
      current++;

      return {
        type: "StringLiteral",
        value: token.value,
      };
    }
    // 开括号 ( 开始 递归
    if (token.type === "paren" && token.value === "(") {
      // 我们会增加`current`变量的值来跳过开括号以选取下一个词素，这是因为在我们的抽象语法树中开括号本身并没有意义。
      token = tokens[++current];

      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };
      // 我们再一次增加`current`变量来跳过包含了函数名的词素。
      token = tokens[++current];
      // 现在我们遍历每一个会成为我们`CallExpression`词素的`params`的词素直到我们遇到一个
      // 闭括号为止。
      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        node.params.push(walk());
        token = tokens[current];
      }

      current++;

      return node;
    }
    throw new TypeError(token.type);
  }
  // 现在，我们来创建我们的抽象语法树。抽象语法树的根节点是一个`Program`节点。
  let ast = {
    type: "Program",
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }
  // 最后，语法分析器会返回抽象语法树。
  return ast;
}
// 我们定义一个traverser函数，这个函数接收抽象语法树以及一个访问者对象。在这个函数内部我们
// 还会定义两个函数……
function traverser(ast, visitor) {
  // `traverseArray`函数，这个函数允许我们遍历一个数组并且调用我们接下来定义的函数："traverseNode`。
  function traverseArray(array, parent) {
    array.forEach((child) => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];

    // 过滤 Program
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;
      // 对于`CallExpression`节点，我们遍历它的`params`属性。
      case "CallExpression":
        traverseArray(node.params, node);
        break;

      case "NumberLiteral":
      case "StringLiteral":
        break;

      default:
        throw new TypeError(node.type);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverseNode(ast, null);
}
/**
 * 接下来就是转换器。我们的转换器会接收我们创造的抽象语法树并将它和一个访问者对象传给traverser
 * 函数。然后创造一个新的抽象语法树。
 *
 * ----------------------------------------------------------------------------
 *   原始 AST                          |   转换后 AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *                                    |         }
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 * ----------------------------------------------------------------------------
 */
// transformer函数，这个函数接收一个lisp抽象语法树对象。
function transformer(ast) {
  // 我们会创造一个新的抽象语法树，这棵树和我们的lisp抽象语法树很像，但是它使用了一个新的类型 (微信小程序、支付宝小程序 。。。)
  let newAst = {
    type: "Program",
    body: [],
  };
  // 引用类型 通过修改ast 来同步修改 newAst
  ast._context = newAst.body;

  // ast 语法树 visitor 访问者
  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        //我们创建一个`NumberLiteral`类型的新节点并添加到父节点的`context`。
        parent._context.push({
          type: "NumberLiteral",
          value: node.value,
        });
      },
    },

    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "StringLiteral",
          value: node.value,
        });
      },
    },

    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name,
          },
          arguments: [],
        };

        node._context = expression.arguments;
        // 接下来我们检测父节点是否是一个`CallExpression`，如果不是的话……
        if (parent.type !== "CallExpression") {
          // 我们将我们的`CallExpression`节点包裹在`ExpressionStatement`节点中。
          // 我们这样做的原因是因为JS中顶层的`CallExpression`实际上是语句。
          expression = {
            // 表达式声明节点
            type: "ExpressionStatement",
            expression: expression,
          };
        }

        parent._context.push(expression);
      },
    },
  });

  return newAst;
}
/**
 * 代码生成器。
 *
 * 我们的代码生成器会递归地调用自身将树中的每一个节点打印出来，最终形成一个巨大的字符串。
 */
function codeGenerator(node) {
  switch (node.type) {
    // 如果我们有一个`Program`节点。我们会使用代码生成器遍历`body`属性中的所有节点然后使用
    // 换行符\n连接起来。
    case "Program":
      // 递归 body下
      return node.body.map(codeGenerator).join("\n");
    // 针对`表达式声明节点`我们会对节点的expression属性调用代码生成器，并加上一个分号 ;
    case "ExpressionStatement":
      return codeGenerator(node.expression) + ";";
    // 针对`CallExpression`我们会打印出`callee`，也就是函数名，加上一个开括号，我们会对
    // `arguments`数组中的每一个节点调用代码生成器，使用逗号连接它们，然后我们添加一个闭括号。
    case "CallExpression":
      return (
        codeGenerator(node.callee) +
        "(" +
        node.arguments.map(codeGenerator).join(", ") +
        ")"
      );

    case "Identifier":
      return node.name;

    case "NumberLiteral":
      return node.value;

    case "StringLiteral":
      return '"' + node.value + '"';

    default:
      throw new TypeError(node.type);
  }
}

/**
 * 终于到了！我们定义我们的`compiler`函数。这个函数会将所有部分连接起来。
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */

function compiler(input) {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  return output;
}
// console.log(compiler("(add 2 2)"));
console.log(
  compiler("(add 2 (subtract 4 (fn 5 6))) (cpt 2 (subtract 4 (fn 5 6)))")
);
// 导出
module.exports = {
  tokenizer,
  parser,
  traverser,
  transformer,
  codeGenerator,
  compiler,
};
