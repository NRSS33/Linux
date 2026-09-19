---
title: 系统调用
tags:
  - linux
  - 系统调用
  - C
created: 2026-09-19
---

## 目录

### 文件操作
- [[#open 打开文件|open 打开文件]]

### 进程控制
- [[#sleep 暂停秒|sleep 暂停秒]]
- [[#usleep 暂停微秒|usleep 暂停微秒]]
- [[#nanosleep 暂停纳秒|nanosleep 暂停纳秒]]

---

## 1. 文件操作

### open 打开文件

> 系统调用版「打开文件」，返回文件描述符（非负 int），失败返回 `-1`。和标准库 `fopen` 的区别：无缓冲、返回 fd 而非 `FILE*`。

- 头文件:`<fcntl.h>`
- 语法:`int open(const char *pathname, int flags, ...);`
- 返回值:成功返回文件描述符，失败返回 `-1`（原因存于 `errno`）
- 常用 flags:

| flag | 含义 |
|------|------|
| `O_RDONLY` | 只读 |
| `O_WRONLY` | 只写 |
| `O_RDWR` | 读写 |
| `O_CREAT` | 不存在则创建（需第三个参数 mode） |
| `O_TRUNC` | 已存在则清空为 0 |
| `O_APPEND` | 追加写（写前定位到文件末尾） |
| `O_EXCL` | 配合 `O_CREAT`，文件已存在则报错 |

- 示例:

```c
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int fd = open("test.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
if (fd == -1) {
    perror("open");
    return 1;
}
printf("文件描述符: %d\n", fd);
close(fd);
```

> 说明:`O_RDONLY`/`O_WRONLY`/`O_RDWR` 三选一；`O_CREAT` 时必须传第三个参数 `mode`（如 `0644`），否则新建文件权限不确定。

## 2. 进程控制

### sleep 暂停秒

> 让当前进程暂停指定秒数。

- 头文件:`<unistd.h>`
- 语法:`unsigned int sleep(unsigned int seconds);`
- 返回值:睡满返回 `0`；被信号打断返回剩余秒数
- 示例:

```c
#include <unistd.h>

sleep(2);      // 暂停 2 秒
```

### usleep 暂停微秒

> 让当前进程暂停指定微秒数（已废弃，建议用 `nanosleep`）。

- 头文件:`<unistd.h>`
- 语法:`int usleep(useconds_t usec);`
- 返回值:成功返回 `0`，失败返回 `-1`
- 示例:

```c
#include <unistd.h>

usleep(500000);      // 暂停 0.5 秒（500000 微秒）
```

### nanosleep 暂停纳秒

> 按「秒 + 纳秒」精确暂停，能处理被信号打断的情况（推荐）。

- 头文件:`<time.h>`
- 语法:`int nanosleep(const struct timespec *req, struct timespec *rem);`
- 参数:`req` 要睡多久 · `rem` 被信号打断后剩余时间（可为 NULL）
- 返回值:成功返回 `0`；被信号打断返回 `-1`，剩余时间写入 `rem`
- 示例:

```c
#include <time.h>

struct timespec ts = {1, 500000000};   // 1 秒 + 0.5 秒
nanosleep(&ts, NULL);
```

> 说明:`sleep`/`usleep` 被信号打断后不会自动续睡，返回剩余时间由你决定是否再睡；`nanosleep` 可传 `rem` 拿到剩余时间，循环续睡直到睡满。
