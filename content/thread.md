---
title: 线程
tags:
  - linux
  - 线程
  - C
created: 2026-10-11
---

## 目录

### 线程创建
- [[#pthread_create 创建线程|pthread_create 创建线程]]

---

## 1. 线程创建

### pthread_create 创建线程

> 在当前进程里创建一个新线程，新线程从指定函数开始执行。线程和进程最大的区别：**同一进程内的多个线程共享地址空间**（全局变量、堆、打开的文件描述符都能直接互相访问），因此线程间通信天然方便，但也要用互斥锁等机制防止竞争。

- 头文件:`<pthread.h>`
- 语法:`int pthread_create(pthread_t *thread, const pthread_attr_t *attr, void *(*start_routine)(void *), void *arg);`
- 参数:
  - `thread`:输出参数，保存新线程的 ID
  - `attr`:线程属性（如栈大小、分离状态），传 `NULL` 用默认属性
  - `start_routine`:新线程要执行的函数，原型必须是 `void *函数名(void *)`
  - `arg`:传给 `start_routine` 的参数（只有一个 `void *`，多个值就打包成结构体）
- 返回值:

| 返回值 | 含义 |
|--------|------|
| `0` | 创建成功 |
| 非 0 | 失败，返回错误码（`EAGAIN` 线程数超限、`EINVAL` 属性非法、`EPERM` 权限不足） |

- 说明:和 `fork` 不同，pthread 函数出错时是**直接返回错误码**，而不是设置 `errno`，所以判断时直接看返回值、别用 `perror`
- 说明:线程函数结束后，其返回值会被保存，等别的线程用 `pthread_join` 收走；既不 `join` 也不 `detach` 的话，线程资源不会释放（类似僵尸进程）
- 说明:编译要加 `-pthread`（不仅链接 pthread 库，还会启用正确的宏和编译选项）
- 示例:创建线程并传入参数

```c
#include <pthread.h>
#include <stdio.h>
#include <unistd.h>

void *worker(void *arg) {          // 线程函数：void * func(void *)
    int id = *(int *)arg;          // 取出参数
    printf("线程 %d 开始运行\n", id);
    sleep(1);
    printf("线程 %d 结束\n", id);
    return NULL;
}

int main(void) {
    pthread_t tid;
    int id = 1;

    if (pthread_create(&tid, NULL, worker, &id) != 0) {   // 创建线程
        fprintf(stderr, "pthread_create 失败\n");
        return 1;
    }

    pthread_join(tid, NULL);       // 等线程结束，回收资源
    printf("主线程退出\n");
    return 0;
}
```

- 编译运行:

```bash
gcc demo.c -o demo -pthread
./demo
# 线程 1 开始运行
# 线程 1 结束
# 主线程退出
```

> 说明:线程函数只能拿到一个 `void *` 参数，需要传多个值就定义结构体、把结构体指针传进去。线程与主线程共享数据，多线程同时读写同一变量要加锁（`pthread_mutex_lock` 等），否则会出现竞态。创建后要么 `pthread_join` 等它结束、要么 `pthread_detach` 让它自己释放，二选一。