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

### 时间
- [[#clock_gettime 获取时间|clock_gettime 获取时间]]

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

## 3. 时间

### clock_gettime 获取时间

> 读取指定时钟的当前时间，结果写入 `struct timespec`（秒 + 纳秒）。取现实时间用 `CLOCK_REALTIME`；**测耗时、做计时用 `CLOCK_MONOTONIC`**，因为它单调递增、不受改系统时间或 NTP 校时影响。

- 头文件:`<time.h>`
- 语法:`int clock_gettime(clockid_t clockid, struct timespec *tp);`
- 参数 `clockid`:要读取的时钟类型；`tp`:输出参数，写入时间
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `0` | 成功 |
| `-1` | 失败（`EINVAL` 时钟类型不支持、`EFAULT` 指针非法） |

- 常用时钟:

| 时钟 ID | 含义 |
|---------|------|
| `CLOCK_REALTIME` | 墙上时钟（现实时间），会被改系统时间影响 |
| `CLOCK_MONOTONIC` | 单调时钟，只增不减，不受改时间影响（计时首选） |
| `CLOCK_MONOTONIC_RAW` | 同 MONOTONIC，但不做 NTP 微调 |
| `CLOCK_PROCESS_CPUTIME_ID` | 当前进程消耗的 CPU 时间 |
| `CLOCK_THREAD_CPUTIME_ID` | 当前线程消耗的 CPU 时间 |

- `struct timespec` 定义:

```c
struct timespec {
    time_t tv_sec;   // 秒
    long   tv_nsec;  // 纳秒，取值 0 ~ 999999999
};
```

- 说明:测耗时就是「前后各取一次、再相减」——开始记一次、结束记一次，两个 `timespec` 相减得到经过时间（纳秒为负时要借位 +1 秒）
- 说明:`clock_gettime` 在多数架构上由内核经 vDSO 提供，不真正陷入内核，开销极小，适合频繁调用；glibc 2.17 之前它在 librt 里需加 `-lrt`，之后已并入 libc
- 说明:老代码里常用的 `gettimeofday()` 已过时，官方推荐改用 `clock_gettime()`
- 示例:测量一段代码的耗时

```c
#include <stdio.h>
#include <time.h>

int main(void) {
    struct timespec start, end;

    clock_gettime(CLOCK_MONOTONIC, &start);   // 1. 开始计时

    for (long i = 0; i < 100000000; i++) {    // 随便做点耗时操作
        ;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);     // 2. 结束计时

    long sec  = end.tv_sec  - start.tv_sec;
    long nsec = end.tv_nsec - start.tv_nsec;
    if (nsec < 0) {                           // 3. 纳秒借位
        sec--;
        nsec += 1000000000L;
    }
    printf("耗时: %ld.%09ld 秒\n", sec, nsec);
    return 0;
}
```

- 编译运行:

```bash
gcc demo.c -o demo
./demo
# 耗时: 0.123456789 秒（数值因机器而异）
```

> 说明:格式化输出现实时间用 `CLOCK_REALTIME` 配合 `localtime`/`strftime`；要测程序性能、做定时器/超时判断，一律用 `CLOCK_MONOTONIC`。
