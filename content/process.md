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
- [[#mkfifo 命名管道|mkfifo 命名管道]]
- [[#shm_open 共享内存|shm_open 共享内存]]
- [[#mq_open 消息队列|mq_open 消息队列]]

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

### mkfifo 命名管道

> 命名管道（named pipe / FIFO）是「有文件名」的管道：先用 `mkfifo` 在磁盘上建一个 FIFO 特殊文件，任何进程——有没有亲缘关系都行——都能像普通文件一样 `open` 它，一写一读。数据仍走内核缓冲区、不落盘，和匿名管道 `pipe()` 一样。

- 头文件:`<sys/types.h>`（提供 `mode_t`）、`<sys/stat.h>`（`mkfifo` 函数原型与权限宏）
- 语法:`int mkfifo(const char *pathname, mode_t mode);`
- 参数 `pathname`:FIFO 文件的路径，会真实出现在文件系统里，`ls -l` 第一个字符显示为 `p`
- 参数 `mode`:权限位（如 `0666`），与 `open`/`chmod` 同规则，实际权限还要再 `& ~umask`
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `0` | 成功 |
| `-1` | 失败，常见 `EEXIST`（路径已存在）、`EACCES`（权限不足） |

- 说明:双方先 `mkfifo` 建好文件、再各自 `open`。`open(O_RDONLY)` 会阻塞直到有写端打开，`open(O_WRONLY)` 会阻塞直到有读端打开——两端都到齐才继续
- 说明:与匿名管道相同的是：半双工、字节流无消息边界、默认 64 KB 缓冲、读端全关时写触发 `SIGPIPE`、写端全关后 `read` 返回 `0`。不同点是靠路径名连接、无亲缘关系也能用，用完要 `unlink` 删掉
- 说明:shell 里也有同名命令 `mkfifo`，等价于这个系统调用，命令行演示：`mkfifo p; cat p & echo hello > p`
- 示例:父进程写、子进程读

```c
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>     // mkfifo 函数原型
#include <sys/types.h>    // mode_t
#include <unistd.h>       // read / write / close / fork / unlink
#include <fcntl.h>        // open
#include <sys/wait.h>     // waitpid

int main(void) {
    const char *fifo = "/tmp/myfifo";

    if (mkfifo(fifo, 0666) == -1) {          // 1. 建 FIFO 文件
        perror("mkfifo");
        return 1;
    }

    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    } else if (pid == 0) {
        // 子进程：读端。open 阻塞，直到父进程也打开写端
        int fd = open(fifo, O_RDONLY);

        char buf[64];
        ssize_t n = read(fd, buf, sizeof(buf) - 1);
        if (n > 0) {
            buf[n] = '\0';
            printf("子进程读到: %s", buf);
        }
        close(fd);
        return 0;
    } else {
        // 父进程：写端。open 阻塞，直到子进程也打开读端
        int fd = open(fifo, O_WRONLY);

        const char *msg = "hello from named pipe\n";
        write(fd, msg, strlen(msg));
        close(fd);

        waitpid(pid, NULL, 0);
        unlink(fifo);                        // 2. 用完删掉这个 FIFO 文件
    }
    return 0;
}
```

- 编译运行:

```bash
gcc demo.c -o demo
./demo
# 子进程读到: hello from named pipe
```

> 说明:`mkfifo` 只是建了个入口文件（`ls -l` 里类型是 `p`），本身不存数据，数据在内存缓冲里。双向通信同样要建两根，或用 `O_RDWR` 打开——但 POSIX 对 `O_RDWR` 打开 FIFO 的行为没有定义，不推荐。无关进程之间点对点传数据用它最省事；要一对多、多进程或跨网络，就得上 socket。

### shm_open 共享内存

> POSIX 共享内存：`shm_open` 在 `/dev/shm` 下创建或打开一个共享内存对象（对象名必须以 `/` 开头），拿到一个文件描述符，再 `ftruncate` 设大小、`mmap` 映射进地址空间，多个进程就能直接读写同一块物理内存。用完 `shm_unlink` 删除对象。它不需要经内核逐字节拷贝，是 IPC 里速度最快的一种。

- 头文件:`<sys/mman.h>`（`shm_open` / `shm_unlink` / `mmap` / `munmap` 函数原型）、`<fcntl.h>`（`O_RDWR` / `O_CREAT` / `O_EXCL` 等 open 标志）、`<sys/stat.h>`（权限宏）、`<sys/types.h>`（`mode_t`）、`<unistd.h>`（`ftruncate` / `close`）
- 语法:`int shm_open(const char *name, int oflag, mode_t mode);`
- 参数 `name`:共享内存对象名，必须以 `/` 开头（如 `/myshm`），且不能包含其他 `/`；Linux 上对应 `/dev/shm/` 下的一个文件
- 参数 `oflag`:open 标志，常用 `O_RDWR`（读写）、`O_CREAT`（不存在则创建）、`O_EXCL`（配合 `O_CREAT`，已存在则报 `EEXIST`）
- 参数 `mode`:创建时的权限位（如 `0666`），仅在配合 `O_CREAT` 时生效
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `>= 0` | 成功，返回文件描述符 |
| `-1` | 失败（`ENOENT` 对象不存在、`EEXIST` 已存在、`EACCES` 权限不足） |

- 语法:`int shm_unlink(const char *name);` —— 删除共享内存对象
- 参数 `name`:与 `shm_open` 相同的对象名
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `0` | 成功 |
| `-1` | 失败（`ENOENT` 对象不存在） |

- 说明:`shm_open` 只是创建/打开对象并返回 fd，此刻对象大小为 0；要用 `ftruncate(fd, size)` 设好大小，`mmap` 才能映射成功
- 说明:映射完成后直接通过指针读写，无需 `read` / `write` 系统调用；用完 `munmap` 解除映射、`close` 关 fd，最后 `shm_unlink` 把对象从 `/dev/shm` 删掉
- 说明:glibc 2.34 之前 `shm_open` / `shm_unlink` 在 librt 里，编译要加 `-lrt`；之后已并入 libc，无需再链接。函数要求 `_POSIX_C_SOURCE >= 200112L`（`gcc` 默认的 gnu11 已包含）
- 说明:共享内存只负责「共享同一块内存」，不提供同步；多个进程同时写会互相覆盖，需要配合 `sem_open` 信号量或 pthread 互斥锁
- 示例:父进程写入、子进程读取

```c
#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <string.h>
#include <fcntl.h>        // O_RDWR / O_CREAT
#include <sys/mman.h>     // shm_open / shm_unlink / mmap / munmap
#include <sys/stat.h>     // 权限宏
#include <sys/types.h>    // mode_t
#include <sys/wait.h>     // waitpid
#include <unistd.h>       // ftruncate / close / fork

#define SHM_NAME "/myshm"
#define SHM_SIZE 64

int main(void) {
    int fd = shm_open(SHM_NAME, O_RDWR | O_CREAT, 0666);  // 1. 创建/打开共享内存对象
    if (fd == -1) {
        perror("shm_open");
        return 1;
    }
    if (ftruncate(fd, SHM_SIZE) == -1) {                  // 2. 设定对象大小，否则映射不了
        perror("ftruncate");
        return 1;
    }

    char *mem = mmap(NULL, SHM_SIZE, PROT_READ | PROT_WRITE,
                     MAP_SHARED, fd, 0);                  // 3. 映射进地址空间
    if (mem == MAP_FAILED) {
        perror("mmap");
        return 1;
    }
    close(fd);                                            // 映射完成后即可关闭 fd

    strcpy(mem, "hello from shared memory\n");           // 先写，再 fork，子进程继承映射
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    } else if (pid == 0) {
        printf("子进程读到: %s", mem);                   // 数据已就绪，直接读共享内存
        munmap(mem, SHM_SIZE);                           // 解除映射
        return 0;
    } else {
        waitpid(pid, NULL, 0);
        munmap(mem, SHM_SIZE);                           // 解除映射
        shm_unlink(SHM_NAME);                            // 4. 删除共享内存对象
    }
    return 0;
}
```

- 编译运行:

```bash
gcc demo.c -o demo        # glibc >= 2.34；更老版本加 -lrt
./demo
# 子进程读到: hello from shared memory
```

> 说明:对象建在 `/dev/shm`（通常是 tmpfs 内存盘，`ls -l /dev/shm` 能看到，类型是普通文件），`shm_unlink` 后立即消失。`mmap` 要用 `MAP_SHARED`，多个进程的映射才指向同一块物理内存、修改互相可见；用 `MAP_PRIVATE` 是写时复制、互不可见，不能用来共享。示例里「先写再 fork」正是为了避开同步竞争；真正的并发读写必须自己加锁。

### mq_open 消息队列

> POSIX 消息队列：用 `mq_open` 创建/打开一个「有名字」的队列，`mq_send` 往队列里放消息、`mq_receive` 取消息。和管道（字节流）不同，它是**面向消息**的——每条消息自带边界、可带优先级，也无需进程间有亲缘关系。用完 `mq_close` 关闭、`mq_unlink` 删除。

- 头文件:`<mqueue.h>`（`mq_open`/`mq_send`/`mq_receive`/`mq_close`/`mq_unlink` 原型与 `mqd_t`）、`<fcntl.h>`（`O_RDWR`/`O_CREAT`/`O_NONBLOCK` 等标志）、`<sys/stat.h>`（权限宏）、`<sys/types.h>`（`mode_t`）
- 语法:`mqd_t mq_open(const char *name, int oflag, ...);`
- 参数 `name`:队列名，必须以 `/` 开头（如 `/myqueue`），不能含其他 `/`；Linux 上对应 `/dev/mqueue/` 下的一个文件
- 参数 `oflag`:访问方式 `O_RDONLY`/`O_WRONLY`/`O_RDWR` 三选一，可叠加 `O_CREAT`（不存在则创建）、`O_EXCL`（配合 `O_CREAT`，已存在则报 `EEXIST`）、`O_NONBLOCK`（收发不阻塞）
- 参数 `mode` 与 `attr`:仅带 `O_CREAT` 时需再传两个参数——权限位（如 `0666`）和 `struct mq_attr *`（队列属性，可传 `NULL` 用默认值）
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `>= 0` | 成功，返回队列描述符 `mqd_t` |
| `(mqd_t)-1` | 失败（`ENOENT` 队列不存在、`EEXIST` 已存在、`EACCES` 权限不足） |

- 语法:`int mq_send(mqd_t mqdes, const char *msg_ptr, size_t msg_len, unsigned int msg_prio);` —— 发送一条消息
- 参数 `msg_ptr`/`msg_len`:消息数据与长度，`msg_len` 须 ≤ `mq_msgsize`；`msg_prio`:优先级 0 ~ `MQ_PRIO_MAX`，数值越大越先被取走
- 返回值:成功返回 `0`；失败返回 `-1`（队列满时阻塞，除非 `O_NONBLOCK`，此时 `errno` 为 `EAGAIN`）

- 语法:`ssize_t mq_receive(mqd_t mqdes, char *msg_ptr, size_t msg_len, unsigned int *msg_prio);` —— 接收一条消息
- 参数 `msg_ptr`/`msg_len`:接收缓冲区与大小，`msg_len` 须 ≥ `mq_msgsize`（小于则报 `EMSGSIZE`）；`msg_prio`:可选，取到的消息优先级（可传 `NULL`）
- 返回值:成功返回实际读到的字节数；失败返回 `-1`（队列空时阻塞，除非 `O_NONBLOCK`，此时 `errno` 为 `EAGAIN`）

- 语法:`int mq_close(mqd_t mqdes);` —— 关闭队列描述符（只是关闭，**不删除**队列）
- 语法:`int mq_unlink(const char *name);` —— 删除队列；要等所有打开它的进程都 `mq_close` 后，队列才真正消失
- 说明:默认属性 `mq_maxmsg=10`（最多 10 条消息）、`mq_msgsize=8192`（每条最长 8192 字节）；需要更大容量时在 `mq_open` 创建时显式传入 `attr`
- 说明:和 `shm_open` 一样，glibc 2.34 之前 `mq_*` 在 librt 里，编译要加 `-lrt`；之后已并入 libc。函数要求 `_POSIX_C_SOURCE >= 200112L`
- 说明:队列对象在 `/dev/mqueue` 下可见（`ls -l /dev/mqueue`），目录不存在时先 `mount -t mqueue none /dev/mqueue` 挂载
- 说明:消息按「优先级从高到低」投递，同优先级按 FIFO；每条消息自带边界，不会像管道那样字节粘连
- 示例:父进程发送、子进程接收

```c
#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <string.h>
#include <fcntl.h>        // O_RDWR / O_CREAT
#include <mqueue.h>       // mq_open / mq_send / mq_receive / mq_close / mq_unlink
#include <sys/stat.h>     // 权限宏
#include <sys/wait.h>     // waitpid
#include <unistd.h>       // fork

#define MQ_NAME "/mymq"
#define MSG_LEN 64

int main(void) {
    struct mq_attr attr = {
        .mq_maxmsg  = 10,      // 最多 10 条消息
        .mq_msgsize = MSG_LEN  // 每条最长 64 字节
    };

    mqd_t mq = mq_open(MQ_NAME, O_RDWR | O_CREAT, 0666, &attr);  // 1. 创建/打开队列
    if (mq == (mqd_t)-1) {
        perror("mq_open");
        return 1;
    }

    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    } else if (pid == 0) {
        // 子进程：接收
        char buf[MSG_LEN];
        unsigned int prio = 0;
        ssize_t n = mq_receive(mq, buf, MSG_LEN, &prio);          // 队列空就阻塞在这里
        if (n >= 0) {
            buf[n] = '\0';
            printf("子进程收到(优先级 %u): %s", prio, buf);
        }
        mq_close(mq);
        return 0;
    } else {
        // 父进程：发送
        const char *msg = "hello from message queue";
        if (mq_send(mq, msg, strlen(msg), 1) == -1) {             // 优先级 1
            perror("mq_send");
        }
        waitpid(pid, NULL, 0);
        mq_close(mq);                                             // 2. 关闭描述符
        mq_unlink(MQ_NAME);                                       // 3. 删除队列
    }
    return 0;
}
```

- 编译运行:

```bash
gcc demo.c -o demo        # glibc >= 2.34；更老版本加 -lrt
./demo
# 子进程收到(优先级 1): hello from message queue
```

> 说明:消息队列与共享内存 `shm_open` 的分工——共享内存最快，但要自己加锁同步；消息队列自带「按消息边界、按优先级」投递，多进程读写场景更省心。队列对象建在 `/dev/mqueue`（`ls -l /dev/mqueue` 可见），`mq_unlink` 后等所有 `mq_close` 完成才真正删除。和命名管道 `mkfifo` 相比，消息队列能按优先级排序、支持多条消息排队、消息有边界；管道则只是无边界、无优先级的字节流 FIFO。
