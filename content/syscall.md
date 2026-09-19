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
