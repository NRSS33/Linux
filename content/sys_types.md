---
title: 系统类型
tags:
  - linux
  - 类型
  - C
created: 2026-09-19
---

## 目录

### 进程与用户 ID
- [[#pid_t 进程 ID|pid_t 进程 ID]]
- [[#uid_t / gid_t 用户与组 ID|uid_t / gid_t 用户与组 ID]]

---

## 1. 进程与用户 ID

### pid_t 进程 ID

> 表示进程 ID 的类型，`fork`、`getpid`、`wait` 等都用它。本质是 `<sys/types.h>` 里的 `typedef`，Linux 下通常是 `int`。

- 头文件:`<sys/types.h>`（`<unistd.h>` 会顺带引入）
- 定义:`typedef int pid_t;`
- 为什么不用 `int`:底层类型随系统可能不同，用 `pid_t` 写更可移植
- 常见用法:

```c
#include <sys/types.h>
#include <unistd.h>

pid_t pid = fork();
pid_t self = getpid();       // 当前进程 PID
pid_t parent = getppid();    // 父进程 PID
```

> 说明:凡是「进程 ID」都该用 `pid_t`，跨平台/换系统时不用改代码。

### uid_t / gid_t 用户与组 ID

> 用户 ID、组 ID 的类型，`getuid`、`getgid`、`chown` 等用它们，底层通常是无符号整数。

- 头文件:`<sys/types.h>`
- 常见用法:

```c
#include <sys/types.h>
#include <unistd.h>

uid_t uid = getuid();     // 当前用户 ID
gid_t gid = getgid();     // 当前组 ID
```

> 说明:和 `pid_t` 同理，用户/组 ID 用 `uid_t`/`gid_t`，不直接写 `int`。

> 附:常见系统类型还有 `off_t`(文件偏移)、`size_t`(无符号大小)、`ssize_t`(有符号大小)、`mode_t`(文件权限)、`time_t`(时间戳)等，大多定义在 `<sys/types.h>`，底层是 int/long 的 `typedef`。
