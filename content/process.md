---
title: 进程
tags:
  - linux
  - 进程
  - C
created: 2026-09-19
---

## 目录

### 进程创建
- [[#system 创建进程|system 创建进程]]
- [[#fork 创建进程|fork 创建进程]]

---

## 1. 进程创建

### system 创建进程

> 用 C 标准库的 `system()` 执行一条 shell 命令，底层靠 `fork` + `exec` + `wait` 完成，是最简单的「创建进程跑一条命令」的方式。

- 头文件:`<stdlib.h>`
- 语法:`int system(const char *command);`
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `-1` | 创建子进程失败（fork 失败） |
| 其他 | 命令的终止状态，格式与 `waitpid` 相同，用 `WIFEXITED` / `WEXITSTATUS` 解析退出码 |

- 说明:`system()` 内部会启动一个子 shell（`/bin/sh -c 命令`）执行，并阻塞等待命令结束后才返回
- 示例:

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>

int main(void) {
    int status = system("ls -l");       // 执行 shell 命令

    if (status == -1) {
        perror("system");               // 创建子进程失败
        return 1;
    }
    if (WIFEXITED(status)) {            // 子进程正常结束
        printf("退出码: %d\n", WEXITSTATUS(status));
    }
    return 0;
}
```

- 编译运行:

```bash
gcc demo.c -o demo
./demo
```

> 注意:`system()` 会把命令字符串交给 shell 解析，若拼接了用户输入，存在命令注入风险；也无法细粒度控制子进程的参数、环境与重定向。需要更灵活控制时，改用 `fork` + `exec` 系列。

### fork 创建进程

> 复制当前进程，创建一个子进程。`fork` 调用一次、返回两次：父进程拿到子进程 PID，子进程拿到 0。

- 头文件:`<unistd.h>`
- 语法:`pid_t fork(void);`
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `> 0` | 在父进程中，返回子进程的 PID |
| `0` | 在子进程中 |
| `-1` | 创建失败 |

- 说明:子进程是父进程的副本，内存、打开的文件描述符都会复制一份；父子进程从 `fork` 之后继续各自执行
- 示例:

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");
        return 1;
    } else if (pid == 0) {
        printf("我是子进程, PID=%d, 父进程=%d\n", getpid(), getppid());
    } else {
        printf("我是父进程, PID=%d, 子进程=%d\n", getpid(), pid);
    }
    return 0;
}
```

> 说明:`fork` 后父子进程的执行顺序不确定（看系统调度）；子进程想运行新程序需配合 `exec` 系列，父进程想等子进程结束用 `wait`。
