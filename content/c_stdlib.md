---
title: C 标准库
tags:
  - c
  - 标准库
  - I/O
created: 2026-09-19
---

## 目录

### 文件 I/O
- [[#fopen 打开文件|fopen 打开文件]]
- [[#fclose 关闭文件|fclose 关闭文件]]
- [[#fwrite 写入字节|fwrite 写入字节]]
- [[#fputs 写入字符串|fputs 写入字符串]]
- [[#fread 读取字节|fread 读取字节]]
- [[#fgets 读取字符串|fgets 读取字符串]]

### 字符读写
- [[#fputc 写入字符|fputc 写入字符]]
- [[#fgetc 读取字符|fgetc 读取字符]]

### 格式化 I/O
- [[#fprintf 格式化写入|fprintf 格式化写入]]
- [[#fscanf 格式化读取|fscanf 格式化读取]]

### 标准流
- [[#标准输入/输出/错误|标准输入/输出/错误]]

---

## 1. 文件 I/O

### fopen 打开文件

> 打开文件，成功返回 `FILE*` 指针，失败返回 `NULL`。

- 头文件:`<stdio.h>`
- 语法:`FILE *fopen(const char *path, const char *mode);`
- 常用模式:

| 模式 | 含义 |
|------|------|
| `"r"` | 只读，文件必须存在 |
| `"w"` | 只写，不存在则创建，存在则清空 |
| `"a"` | 追加，不存在则创建，存在则从末尾写 |
| `"r+"` | 读写，文件必须存在 |
| `"w+"` | 读写，清空或创建 |
| `"a+"` | 读写追加 |

- 示例:

```c
FILE *fp = fopen("test.txt", "w");
if (fp == NULL) {
    perror("fopen");
    return 1;
}
```

> 说明:模式加 `b` 表示二进制（如 `"rb"`、`"wb"`），Windows 下区分文本/二进制，Linux 下无区别。

### fclose 关闭文件

> 关闭用 `fopen` 打开的文件，释放文件指针；忘记关闭可能丢失缓冲区数据。

- 头文件:`<stdio.h>`
- 语法:`int fclose(FILE *stream);`
- 返回值:成功返回 `0`，失败返回 `EOF`（-1）
- 示例:

```c
fclose(fp);
```

### fwrite 写入字节

> 把内存里的一段字节按元素写入文件，适合写二进制数据（数组、结构体等）。

- 头文件:`<stdio.h>`
- 语法:`size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);`
- 参数:`ptr` 数据首地址 · `size` 每个元素字节数 · `nmemb` 元素个数 · `stream` 文件指针
- 返回值:实际写入的元素个数（与 `nmemb` 不等说明写入失败）
- 示例:

```c
int arr[] = {1, 2, 3};
size_t n = fwrite(arr, sizeof(int), 3, fp);
printf("写入 %zu 个元素\n", n);
```

### fputs 写入字符串

> 向文件写入一个字符串（不含结尾的 `\0`）。

- 头文件:`<stdio.h>`
- 语法:`int fputs(const char *s, FILE *stream);`
- 返回值:成功返回非负值，失败返回 `EOF`（-1）
- 示例:

```c
fputs("hello, world\n", fp);
```

> 说明:`fputs` 不会自动加换行，需要换行要自己在字符串里写 `\n`。

### fread 读取字节

> 从文件读取字节到内存缓冲区，按元素读，适合读二进制数据。

- 头文件:`<stdio.h>`
- 语法:`size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);`
- 返回值:实际读到的元素个数（小于 `nmemb` 说明已到文件末尾或出错）
- 示例:

```c
int buf[3];
size_t n = fread(buf, sizeof(int), 3, fp);
printf("读到 %zu 个元素\n", n);
```

### fgets 读取字符串

> 从文件读取一行字符串（含换行符），读到缓冲区里。

- 头文件:`<stdio.h>`
- 语法:`char *fgets(char *s, int size, FILE *stream);`
- 参数:`s` 缓冲区 · `size` 最多读 `size-1` 个字符 · `stream` 文件指针
- 返回值:成功返回 `s`，到文件末尾或失败返回 `NULL`
- 示例:

```c
char line[256];
while (fgets(line, sizeof(line), fp) != NULL) {
    printf("%s", line);
}
```

> 说明:`fgets` 读到换行符或 `size-1` 个字符为止，会保留换行符，末尾自动补 `\0`。

## 2. 字符读写

### fputc 写入字符

> 向文件写入一个字符。

- 头文件:`<stdio.h>`
- 语法:`int fputc(int c, FILE *stream);`
- 返回值:成功返回写入的字符，失败返回 `EOF`（-1）
- 示例:

```c
fputc('A', fp);
fputc('\n', fp);
```

### fgetc 读取字符

> 从文件读取一个字符。

- 头文件:`<stdio.h>`
- 语法:`int fgetc(FILE *stream);`
- 返回值:成功返回读取的字符（int），到文件末尾或失败返回 `EOF`（-1）
- 示例:

```c
int c;
while ((c = fgetc(fp)) != EOF) {
    putchar(c);      // 打印到屏幕
}
```

## 3. 格式化 I/O

### fprintf 格式化写入

> 按格式串把数据写入文件，用法和 `printf` 一样，只是多了文件指针。

- 头文件:`<stdio.h>`
- 语法:`int fprintf(FILE *stream, const char *format, ...);`
- 示例:

```c
int age = 18;
fprintf(fp, "姓名: %s 年龄: %d\n", "小明", age);
```

### fscanf 格式化读取

> 按格式串从文件读取数据，用法和 `scanf` 一样，只是多了文件指针。

- 头文件:`<stdio.h>`
- 语法:`int fscanf(FILE *stream, const char *format, ...);`
- 返回值:成功匹配并赋值的项数，到文件末尾返回 `EOF`
- 示例:

```c
char name[32];
int age;
fscanf(fp, "%s %d", name, &age);
```

## 4. 标准流

### 标准输入/输出/错误

> C 程序启动时自动打开的 3 个标准流，都是 `FILE*` 指针，可直接当文件用。

| 流 | 全称 | 作用 | 默认设备 |
|----|------|------|---------|
| `stdin` | 标准输入 | 读入数据 | 键盘 |
| `stdout` | 标准输出 | 正常输出 | 屏幕 |
| `stderr` | 标准错误 | 错误/诊断输出 | 屏幕 |

- 说明:`printf` 等价 `fprintf(stdout, ...)`，`scanf` 等价 `fscanf(stdin, ...)`；`stdout` 默认行缓冲，`stderr` 默认无缓冲
- 示例:

```c
fprintf(stdout, "这是正常输出\n");
fprintf(stderr, "这是错误信息\n");
```

> 说明:`stderr` 无缓冲，报错信息不会因程序崩溃而丢失；shell 重定向时 `>` 只重定向 stdout，`2>` 才重定向 stderr。
