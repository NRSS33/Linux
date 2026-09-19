---
title: Makefile
tags:
  - make
  - 构建
  - 编译
created: 2026-09-19
---

## 目录

### 基本规则
- [[#基本结构|基本结构]]
- [[#自动推导|自动推导]]
- [[#伪目标 (.PHONY)|伪目标 (.PHONY)]]

### 变量
- [[#定义与引用变量|定义与引用变量]]

---

## 1. 基本规则

### 基本结构

> Makefile 由一条条「规则」组成，每条规则描述「如何从依赖文件生成目标文件」。

- 语法:

```makefile
目标: 依赖1 依赖2
	命令
```

- 说明:
  - `目标`:要生成的文件名，或某个动作名（配合 `.PHONY` 使用）
  - `依赖`:生成目标所需的文件；只有目标不存在、或依赖比目标更新时才执行命令
  - `命令`:生成目标的 shell 命令，**行首必须是 Tab**（不能用空格）
- 示例:

```makefile
hello: hello.c
	gcc hello.c -o hello

clean:
	rm -f hello
```

- 运行:

```bash
make            # 生成第一个目标 hello
make hello      # 生成指定目标
make clean      # 执行 clean
```

> 注意:`命令` 行的缩进必须是 **Tab**，用空格会报 `Makefile:2: *** missing separator.  Stop.` 错误。

### 自动推导

> make 内置了一组「隐式规则」：像 `.c → .o` 这类常见编译，即使不写命令，make 也能按文件后缀自动推导出生成命令。

- 说明:声明了目标和依赖、但省略命令时，make 根据目标/依赖的后缀自动套用内置规则
- 常见隐式规则:

| 规则 | 自动执行的命令 |
|------|----------------|
| `.c` → `.o` | `$(CC) $(CFLAGS) -c` |
| `.cpp` / `.cc` → `.o` | `$(CXX) $(CXXFLAGS) -c` |

- 示例:不写命令，让 make 自己推导

```makefile
hello: hello.o
	gcc hello.o -o hello

hello.o: hello.c    # 没写命令，make 自动执行 cc -c hello.c -o hello.o
```

- 配合变量自定义推导命令:

```makefile
CC = gcc
CFLAGS = -Wall -g

hello.o: hello.c    # 自动推导成 gcc -Wall -g -c hello.c -o hello.o
```

> 说明:自动推导只对「命名符合约定」的目标生效（如 `foo.o` 依赖同名 `foo.c`）；依赖关系复杂时仍需自己写规则。

### 伪目标 (.PHONY)

> 有些目标不是要生成的文件，而是「执行某个动作」的名字（如 `clean`）。用 `.PHONY` 声明后，make 不会拿它当文件判断时间戳，每次都执行。

- 语法:`.PHONY: 目标名`
- 为什么需要:若不声明，目录里恰好有个叫 `clean` 的文件时，make 会把 `clean` 当成已存在且最新的文件，从而跳过命令不执行
- 示例:

```makefile
.PHONY: clean

clean:
	rm -f hello hello.o
```

- 运行:

```bash
make clean       # 每次都执行 rm，不受同名文件影响
```

> 说明:`clean`、`all`、`install`、`test` 这类纯动作目标，建议都声明为 `.PHONY`，避免同名文件或时间戳导致的误判。

## 2. 变量

### 定义与引用变量

> 用变量保存编译命令、编译选项等重复内容，避免到处写死，改一处即可。

- 定义:`变量名 = 值`
- 引用:`$(变量名)` 或 `${变量名}`
- 赋值符:

| 赋值符 | 含义 | 说明 |
|--------|------|------|
| `=` | 递归展开 | 用到时才展开，可先引用后定义 |
| `:=` | 立即展开 | 赋值时立刻展开（推荐） |
| `?=` | 未定义才赋值 | 变量已有值则不再覆盖 |
| `+=` | 追加 | 在原有值后面追加 |

- 示例:

```makefile
CC = gcc
CFLAGS = -Wall -g

hello: hello.c
	$(CC) $(CFLAGS) hello.c -o hello
```

- 展开区别示例:

```makefile
A = $(B)          # 递归展开：A 先记下 $(B)
B = hello
# 到这里 $(A) 才展开成 hello

C := $(D)         # 立即展开：此刻 D 未定义，C 变空
D = world
# $(C) 仍为空，赋值时就已经展开过了
```

> 说明:`=` 遇 `A = $(A)` 这类自引用会死循环报错，日常写编译器/选项这类简单变量用 `:=` 更稳妥。
