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

### 进程回收
- [[#waitpid 等待子进程|waitpid 等待子进程]]

### 进程间通信
- [[#pipe 匿名管道|pipe 匿名管道]]

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

## 2. 进程回收

### waitpid 等待子进程

> 让父进程等待指定的子进程结束并回收它，避免留下僵尸进程。比 `wait` 更灵活：可指定 PID、可用 `WNOHANG` 非阻塞轮询。

- 头文件:`<sys/wait.h>`
- 语法:`pid_t waitpid(pid_t pid, int *status, int options);`
- 参数 `pid`:

| 取值 | 含义 |
|------|------|
| `> 0` | 等待 PID 为 `pid` 的那个子进程 |
| `== 0` | 等待与调用者同进程组的任意子进程 |
| `== -1` | 等待任意子进程（等价 `wait`） |
| `< -1` | 等待进程组 ID 为 `-pid` 的任意子进程 |

- 参数 `status`:子进程退出状态（可传 `NULL` 不关心），配合 `WIFEXITED` / `WEXITSTATUS` 等宏解析
- 参数 `options`:常用 `WNOHANG`（无子进程结束时立即返回 `0`，不阻塞）
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `> 0` | 结束的子进程 PID |
| `0` | 配合 `WNOHANG`，暂时没有子进程结束 |
| `-1` | 出错（如没有子进程可等，`errno` 为 `ECHILD`） |

- 示例:

```c
#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");
        return 1;
    } else if (pid == 0) {
        printf("子进程 PID=%d，3 秒后退出\n", getpid());
        sleep(3);
        return 42;                              // 子进程退出码 42
    } else {
        int status;
        pid_t w = waitpid(pid, &status, 0);     // 阻塞等这个子进程结束
        if (w == -1) {
            perror("waitpid");
            return 1;
        }
        if (WIFEXITED(status)) {
            printf("子进程 %d 正常退出，退出码 %d\n", w, WEXITSTATUS(status));
        }
    }
    return 0;
}
```

> 说明:子进程结束后若父进程不回收，会变成僵尸进程（占着 PCB，`ps` 里显示 `Z`）；`waitpid(pid, NULL, WNOHANG)` 可非阻塞轮询、避免父进程空等。`status` 解析宏除 `WIFEXITED`/`WEXITSTATUS` 外，还有 `WIFSIGNALED`（被信号杀死，用 `WTERMSIG` 取信号）等。

## 3. 进程间通信

### pipe 匿名管道

> 匿名管道（anonymous pipe）是最简单的进程间通信方式：父进程调用 `pipe()` 拿到一对文件描述符，再 `fork` 让子进程继承，父子进程就能通过同一个内核缓冲区一写一读。

- 头文件:`<unistd.h>`
- 语法:`int pipe(int pipefd[2]);`
- 参数 `pipefd`:长度为 2 的数组，由内核填入两个文件描述符

| 数组元素 | 方向 | 说明 |
|----------|------|------|
| `pipefd[0]` | 读端 | 只能 `read()`，拿它写是 `EBADF` |
| `pipefd[1]` | 写端 | 只能 `write()`，拿它读是 `EBADF` |

- 返回值:

| 返回值 | 含义 |
|--------|------|
| `0` | 成功 |
| `-1` | 失败（`EMFILE` 进程打开的 fd 已达上限 / `ENFILE` 系统级上限） |

- 说明:管道是半双工的，同一时刻只能单向传数据；要双向通信就 `pipe()` 两次，两个进程各持有方向相反的两端
- 说明:`pipe()` 必须在 `fork()` 之前调用，子进程才能继承这两个描述符；fork 之后父子各自 `close()` 掉自己用不到的一端
- 说明:数据传输是字节流、先进先出，没有消息边界；内核缓冲区默认 64 KB（`fcntl` 的 `F_GETPIPE_SZ` / `F_SETPIPE_SZ` 可查可改），写满后 `write()` 阻塞
- 说明:所有写端都 `close()` 后，`read()` 返回 `0`（EOF）；反过来读端全关、只剩写端时，`write()` 会收到 `SIGPIPE`（默认终止进程，可用 `signal(SIGPIPE, SIG_IGN)` 忽略，改为返回 `-1`、`errno` 为 `EPIPE`）
- 示例:父进程写、子进程读

```c
#include <stdio.h>
#include <string.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int fd[2];

    if (pipe(fd) == -1) {               // 1. 先建管道
        perror("pipe");
        return 1;
    }

    pid_t pid = fork();                 // 2. 再 fork，子进程继承 fd
    if (pid < 0) {
        perror("fork");
        return 1;
    } else if (pid == 0) {
        // 子进程：只读，先关掉用不到的写端
        close(fd[1]);

        char buf[64];
        ssize_t n = read(fd[0], buf, sizeof(buf) - 1);   // 没数据就阻塞在这里
        if (n > 0) {
            buf[n] = '\0';
            printf("子进程收到: %s", buf);
        }
        close(fd[0]);
        return 0;
    } else {
        // 父进程：只写，先关掉用不到的读端
        close(fd[0]);

        const char *msg = "hello from parent\n";
        write(fd[1], msg, strlen(msg));
        close(fd[1]);                   // 关掉写端，子进程 read 才会返回 0

        waitpid(pid, NULL, 0);          // 回收子进程
    }
    return 0;
}
```

- 编译运行:

```bash
gcc demo.c -o demo
./demo
# 子进程收到: hello from parent
```

> 说明:shell 里的 `cmd1 | cmd2` 就是这个原理——shell 建一根管道、fork 出两个子进程，再用 `dup2` 把管道两端分别接到它们的标准输出/标准输入上。匿名管道只能用于有亲缘关系的进程；互不相干的进程要用命名管道 `mkfifo`（有文件名、可 `open`）或 socket。

