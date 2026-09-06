---
title: Linux 命令
tags:
  - linux
  - 命令
created: 2026-09-04
---

## 目录

### 文件与目录
- [[#ls]] — 列出目录
- [[#cd]] — 切换目录
- [[#pwd]] — 当前路径
- [[#mkdir]] — 创建目录
- [[#touch]] — 创建文件
- [[#cp]] — 复制文件/目录
- [[#mv]] — 移动/重命名
- [[#rm]] — 删除文件/目录
- [[#rmdir]] — 删除空目录
- [[#ln]] — 创建链接

### 文本查看与处理
- [[#cat]] — 查看文件内容
- [[#less]] — 分页查看
- [[#head]] — 查看文件开头
- [[#tail]] — 查看文件末尾/跟踪
- [[#grep]] — 搜索/过滤文本
- [[#wc]] — 统计行数
- [[#sed]] — 文本替换
- [[#awk]] — 按列处理文本
- [[#sort]] — 排序
- [[#uniq]] — 去重
- [[#echo]] — 输出文本

### 权限管理
- [[#chmod]] — 修改权限
- [[#chown]] — 修改属主

### 进程管理
- [[#ps]] — 查看进程
- [[#top]] — 实时监控
- [[#kill]] — 按 PID 结束
- [[#killall]] — 按名称结束
- [[#jobs]] — 后台任务
- [[#bg]] — 放后台运行
- [[#nohup]] — 后台不挂断
- [[#systemctl]] — 服务管理

### 系统信息
- [[#uname]] — 系统/内核信息
- [[#hostname]] — 主机名
- [[#uptime]] — 运行时长/负载
- [[#date]] — 日期时间
- [[#free]] — 查看内存
- [[#env]] — 环境变量
- [[#export]] — 设置环境变量
- [[#history]] — 历史命令
- [[#w]] — 登录用户/负载
- [[#who]] — 登录用户
- [[#exit]] — 退出终端
- [[#man]] — 命令手册

### 磁盘与存储
- [[#df]] — 磁盘分区
- [[#du]] — 目录大小
- [[#mount]] — 挂载
- [[#umount]] — 卸载
- [[#lsblk]] — 块设备

### 网络
- [[#ping]] — 测试连通性
- [[#curl]] — HTTP 请求
- [[#wget]] — 下载文件
- [[#netstat]] — 网络端口(旧)
- [[#ss]] — 监听端口
- [[#ifconfig]] — 网络接口(旧)
- [[#ip]] — 网络接口
- [[#scp]] — 远程复制
- [[#ssh]] — 远程登录
- [[#dig]] — DNS 解析

### 压缩与解压
- [[#tar]] — 打包/解包
- [[#gzip]] — 压缩 .gz
- [[#gunzip]] — 解压 .gz
- [[#zip]] — 压缩 zip
- [[#unzip]] — 解压 zip

### 用户与用户组
- [[#useradd]] — 添加用户
- [[#usermod]] — 修改用户
- [[#userdel]] — 删除用户
- [[#passwd]] — 修改密码
- [[#su]] — 切换用户
- [[#sudo]] — root 权限执行

### 搜索与查找
- [[#find]] — 按条件查找
- [[#locate]] — 快速定位
- [[#which]] — 命令路径
- [[#whereis]] — 查找二进制

### 系统管理
- [[#shutdown]] — 关机/重启/定时
- [[#reboot]] — 重启
- [[#poweroff]] — 立即关机
- [[#halt]] — 停止系统
- [[#crontab]] — 定时任务
- [[#alias]] — 命令别名

### 编辑器
- [[#vim]] — 文本编辑器

### 服务管理
- [[#常用服务速查]] — 常见服务状态/启停
- [[#服务列表与自启]] — 查看服务列表

### 软件包管理
- [[#apt]] — 软件包管理

### Shell 脚本
- [[#sh]] — 执行脚本
- [[#bash]] — 执行脚本(bash)
- [[#source]] — 当前 shell 加载
- [[#脚本直接执行]] — 直接运行脚本
- [[#获取变量值]] — 用 $ 取值

---

## 1. 文件与目录

### ls

> 列出目录内容。

- 语法:`ls [选项] [路径]`
- 常用选项:`-l` 详情 · `-a` 隐藏 · `-h` 人类可读 · `-t` 按时间
- 示例:

```bash
ls
ls -lah
```

### cd

> 切换目录。

- 语法:`cd [目录]`
- 示例:

```bash
cd /etc
cd ..        # 上级目录
cd ~         # 主目录
cd -         # 返回上次目录
```

### pwd

> 显示当前路径。

- 语法:`pwd`
- 示例:

```bash
pwd
```

### mkdir

> 创建目录。

- 语法:`mkdir [选项] 目录`
- 常用选项:`-p` 递归创建多级
- 示例:

```bash
mkdir test
mkdir -p a/b/c
```

### touch

> 创建空文件 / 更新时间戳。

- 语法:`touch 文件`
- 示例:

```bash
touch file.txt
```

### cp

> 复制文件或目录。

- 语法:`cp [选项] 源 目标`
- 常用选项:`-r` 递归 · `-p` 保留属性 · `-i` 覆盖询问
- 示例:

```bash
cp a.txt b.txt
cp -rp src/ dst/
```

### mv

> 移动 / 重命名。

- 语法:`mv [选项] 源 目标`
- 常用选项:`-i` 覆盖询问
- 示例:

```bash
mv a.txt b.txt
mv file.txt /tmp/
```

### rm

> 删除文件 / 目录。

- 语法:`rm [选项] 文件`
- 常用选项:`-r` 递归 · `-f` 强制 · `-i` 确认
- 示例:

```bash
rm file.txt
rm -rf dir/     # 危险,慎用
```

### rmdir

> 删除空目录。

- 语法:`rmdir 目录`
- 示例:

```bash
rmdir empty_dir
```

### ln

> 创建链接。

- 语法:`ln [选项] 目标 链接名`
- 常用选项:`-s` 软链接
- 示例:

```bash
ln -s /usr/local/nginx /opt/nginx
```

## 2. 文本查看与处理

### cat

> 输出文件全部内容。

- 语法:`cat [选项] 文件`
- 常用选项:`-n` 显示行号
- 示例:

```bash
cat file.txt
cat -n file.txt
```

### less

> 分页查看文件(可上下翻)。

- 语法:`less 文件`
- 快捷键:`q` 退出 · `/` 搜索 · `g` 首行 · `G` 末行
- 示例:

```bash
less app.log
```

### head

> 查看文件开头 N 行。

- 语法:`head [选项] 文件`
- 常用选项:`-n` 行数
- 示例:

```bash
head file.txt
head -n 20 file.txt
```

### tail

> 查看文件末尾 N 行 / 实时跟踪。

- 语法:`tail [选项] 文件`
- 常用选项:`-f` 实时跟踪 · `-n` 行数
- 示例:

```bash
tail -f app.log
tail -n 50 app.log
```

### grep

> 搜索 / 过滤匹配文本。

- 语法:`grep [选项] 模式 [文件]`
- 常用选项:`-i` 忽略大小写 · `-r` 递归 · `-n` 行号 · `-v` 取反 · `-E` 扩展正则 · `-o` 只输出匹配 · `-w` 全词 · `-e` 多模式
- 示例:

```bash
grep "error" app.log
grep -rn "error" /var/log/
grep -v "^#" conf.conf                    # 过滤注释行
grep -v "^#" conf.conf | grep -v "^$"     # 过滤注释和空行
grep -E "error|warn" app.log              # 多模式(扩展正则)
grep -o "[0-9.]*" access.log              # 只输出匹配部分
```

### wc

> 统计行数 / 字数 / 字节。

- 语法:`wc [选项] 文件`
- 常用选项:`-l` 行数 · `-c` 字节 · `-w` 单词
- 示例:

```bash
wc -l file.txt
```

### sed

> 流式文本编辑 / 替换。

- 语法:`sed [选项] '动作' 文件`
- 常用选项:`-i` 直接修改 · `-n` 配合 p 打印
- 示例:

```bash
sed 's/old/new/g' file.txt
sed -i 's/old/new/g' file.txt
sed -n '10p' file.txt
```

### awk

> 按列/字段处理文本。

- 语法:`awk [选项] '{动作}' 文件`
- 常用选项:`-F` 指定分隔符
- 示例:

```bash
awk '{print $1}' file.txt              # 输出第 1 列
awk -F: '{print $1,$3}' /etc/passwd    # 以 : 分隔,输出第 1、3 列
```

### sort

> 排序。

- 语法:`sort [选项] 文件`
- 常用选项:`-n` 数值 · `-r` 降序 · `-u` 去重 · `-k` 按列
- 示例:

```bash
sort file.txt
sort -rn -k 3 file.txt
```

### uniq

> 去重(相邻行)。

- 语法:`uniq [选项]`
- 常用选项:`-c` 计数
- 示例:

```bash
sort file.txt | uniq
sort file.txt | uniq -c
```

### echo

> 输出文本 / 变量。

- 语法:`echo [选项] 内容`
- 常用选项:`-e` 解析转义符
- 示例:

```bash
echo "hello"
echo $PATH
echo "line" >> file.txt
```

## 3. 权限管理

### chmod

> 修改文件权限。

- 语法:`chmod [选项] 权限 文件`
- 常用选项:`-R` 递归
- 权限:`r` 读(4) · `w` 写(2) · `x` 执行(1);`u` 属主 · `g` 属组 · `o` 其他 · `a` 全部
- 常用数字权限:

| 数字 | 权限 | 说明 |
|------|------|------|
| `755` | rwxr-xr-x | 属主可读写执行,他人只读执行(脚本/目录常用) |
| `644` | rw-r--r-- | 属主可读写,他人只读(普通文件常用) |
| `700` | rwx------ | 仅属主可读写执行 |
| `600` | rw------- | 仅属主可读写(私密文件) |
| `777` | rwxrwxrwx | 所有人可读写执行(危险,慎用) |

- 示例:

```bash
chmod +x run.sh       # 加执行权限
chmod +w file.txt     # 加写权限
chmod -w file.txt     # 去掉写权限
chmod +r file.txt     # 加读权限
chmod u+w file.txt    # 属主加写
chmod 644 file.txt    # rw-r--r--
chmod 755 run.sh      # rwxr-xr-x
chmod -R 755 dir/     # 递归
```

### chown

> 修改文件属主/属组。

- 语法:`chown [选项] 用户[:组] 文件`
- 常用选项:`-R` 递归
- 示例:

```bash
chown www:www file.txt
chown -R www:www /var/www
```

## 4. 进程管理

### ps

> 查看进程。

- 语法:`ps [选项]`
- 常用选项:`aux` / `-ef` 查看所有进程
- 示例:

```bash
ps aux
ps aux | grep nginx
```

### top

> 实时监控进程与资源。

- 语法:`top [选项]`
- 快捷键:`P` 按 CPU 排序 · `M` 按内存排序 · `q` 退出
- 示例:

```bash
top
```

### kill

> 结束进程(按 PID)。

- 语法:`kill [选项] PID`
- 常用选项:`-9` 强制 · `-15` 正常终止
- 示例:

```bash
kill 1234
kill -9 1234
```

### killall

> 结束进程(按名称)。

- 语法:`killall [选项] 进程名`
- 示例:

```bash
killall nginx
```

### jobs

> 查看当前 shell 的后台任务。

- 语法:`jobs [选项]`
- 常用选项:`-l` 显示 PID
- 示例:

```bash
jobs
```

### bg

> 把挂起的任务放到后台继续运行。

- 语法:`bg [任务号]`
- 示例:

```bash
bg %1
```

### nohup

> 后台运行,退出终端不中断。

- 语法:`nohup 命令 &`
- 示例:

```bash
nohup ./app > app.log 2>&1 &
```

### systemctl

> 服务管理(systemd)。

- 语法:`systemctl 动作 服务`
- 常用动作:

| 动作 | 作用 |
|------|------|
| `status` | 查看服务运行状态 |
| `start` | 启动服务 |
| `stop` | 停止服务 |
| `restart` | 重启服务 |
| `reload` | 重新加载配置(不中断服务) |
| `enable` | 设置开机自启 |
| `disable` | 取消开机自启 |

- 示例:

```bash
systemctl status nginx     # 查看 nginx 运行状态
systemctl start nginx      # 启动 nginx
systemctl stop nginx       # 停止 nginx
systemctl restart nginx    # 重启 nginx
systemctl reload nginx     # 重新加载配置
systemctl enable nginx     # 设置开机自启
systemctl disable nginx    # 取消开机自启
```

## 5. 系统信息

### uname

> 查看系统 / 内核信息。

- 语法:`uname [选项]`
- 常用选项:`-a` 全部 · `-r` 内核版本
- 示例:

```bash
uname -a
uname -r
```

### hostname

> 查看 / 设置主机名。

- 语法:`hostname [选项]`
- 示例:

```bash
hostname
hostnamectl set-hostname myserver
```

### uptime

> 查看运行时长与负载。

- 语法:`uptime`
- 示例:

```bash
uptime
```

### date

> 查看 / 设置日期时间。

- 语法:`date [选项] [格式]`
- 常用选项:`-d` 显示指定时间 · `-s` 设置系统时间(需 root)
- 常用格式:`%Y` 年 · `%m` 月 · `%d` 日 · `%H` 时 · `%M` 分 · `%S` 秒 · `%s` 时间戳 · `%A` 星期
- 示例:

```bash
date                              # 当前日期时间
date +%Y-%m-%d                    # 如 2024-01-01
date +%s                          # unix 时间戳
date -d "2024-01-01"              # 显示指定日期
date -d "yesterday"               # 昨天
date -d "1 day ago"               # 1 天前
date -d "@1700000000"             # 时间戳转日期
sudo date -s "2024-01-01 12:00:00"  # 设置系统时间
```

### free

> 查看内存使用。

- 语法:`free [选项]`
- 常用选项:`-h` 人类可读
- 示例:

```bash
free -h
```

### env

> 查看环境变量。

- 语法:`env [选项]`
- 示例:

```bash
env
```

### export

> 设置环境变量。

- 语法:`export 变量=值`
- 示例:

```bash
export PATH=/usr/local/bin:$PATH
```

### history

> 查看 / 使用命令历史。

- 语法:`history [选项] [数量]`
- 常用选项:`-c` 清空当前会话历史 · `-w` 立即写入历史文件
- 快捷用法:

| 用法 | 作用 |
|------|------|
| `!!` | 重复执行上一条命令 |
| `!N` | 执行第 N 条历史命令 |
| `!$` | 上一条命令的最后一个参数 |
| `!关键字` | 执行最近一条以关键字开头的命令 |
| `Ctrl+R` | 反向搜索历史 |

- 示例:

```bash
history              # 查看全部历史
history 20           # 最近 20 条
history -c           # 清空当前会话历史
sudo !!              # 用 sudo 重跑上一条命令
!100                 # 执行第 100 条历史命令
```

### w

> 查看登录用户及负载。

- 语法:`w`
- 示例:

```bash
w
```

### who

> 查看登录用户。

- 语法:`who`
- 示例:

```bash
who
```

### exit

> 退出当前 shell / 终端。

- 语法:`exit [状态码]`
- 示例:

```bash
exit
exit 0
```

### man

> 查看命令手册。

- 语法:`man 命令`
- 示例:

```bash
man ls
```

## 6. 磁盘与存储

### df

> 查看磁盘分区使用情况。

- 语法:`df [选项]`
- 常用选项:`-h` 人类可读 · `-T` 显示文件系统类型
- 示例:

```bash
df -h
```

### du

> 统计文件/目录占用空间。

- 语法:`du [选项] [路径]`
- 常用选项:`-h` 人类可读 · `-s` 汇总 · `--max-depth=1` 层级
- 示例:

```bash
du -sh *
du -h --max-depth=1 .
```

### mount

> 挂载文件系统。

- 语法:`mount [选项] 设备 挂载点`
- 常用选项:`-t` 类型 · `-o` 选项
- 示例:

```bash
mount /dev/sdb1 /mnt
mount -t nfs 192.168.1.10:/data /mnt/nfs
```

### umount

> 卸载文件系统。

- 语法:`umount 挂载点`
- 示例:

```bash
umount /mnt
```

### lsblk

> 查看块设备(磁盘、分区)。

- 语法:`lsblk [选项]`
- 示例:

```bash
lsblk
```

## 7. 网络

### ping

> 测试网络连通性。

- 语法:`ping [选项] 主机`
- 常用选项:`-c` 次数
- 示例:

```bash
ping -c 4 www.baidu.com
```

### curl

> 发送 HTTP 请求 / 下载。

- 语法:`curl [选项] URL`
- 常用选项:`-I` 仅响应头 · `-X` 请求方法 · `-d` 数据 · `-H` 请求头 · `-o` 输出到文件
- 示例:

```bash
curl -I https://example.com
curl -X POST -H "Content-Type: application/json" -d '{"a":1}' http://localhost/api
curl -o file.tar.gz https://example.com/file.tar.gz
```

### wget

> 下载文件。

- 语法:`wget [选项] URL`
- 常用选项:`-c` 断点续传 · `-O` 指定文件名
- 示例:

```bash
wget https://example.com/file.tar.gz
wget -c -O out.tar.gz https://example.com/file.tar.gz
```

### netstat

> 查看网络连接 / 端口(旧,新系统用 ss)。

- 语法:`netstat [选项]`
- 常用选项:`-tunlp` 查看监听端口
- 示例:

```bash
netstat -tunlp
```

### ss

> 查看套接字 / 监听端口(推荐)。

- 语法:`ss [选项]`
- 常用选项:`-tunlp` 查看监听端口
- 示例:

```bash
ss -tunlp
```

### ifconfig

> 查看 / 配置网络接口(旧,新系统用 ip)。

- 语法:`ifconfig [接口]`
- 示例:

```bash
ifconfig
```

### ip

> 查看 / 配置网络接口、地址与路由(推荐,替代 ifconfig)。

- 语法:`ip 子命令 [选项]`
- 常用子命令:

| 子命令 | 作用 |
|--------|------|
| `ip addr` | 查看 / 管理 IP 地址(简写 `ip a`) |
| `ip link` | 查看 / 管理网络接口(链路层,启用/禁用网卡) |
| `ip route` | 查看 / 管理路由表 |

- 示例:

```bash
ip addr                          # 查看所有网卡的 IP 地址
ip a                             # 同上,简写
ip link                          # 查看网络接口状态(UP/DOWN)
ip link set eth0 up              # 启用网卡 eth0
ip link set eth0 down            # 禁用网卡 eth0
ip route                         # 查看路由表
ip route add default via 192.168.1.1   # 添加默认网关
```

### scp

> 远程复制文件。

- 语法:`scp [选项] 源 目标`
- 常用选项:`-r` 递归 · `-P` 端口
- 示例:

```bash
scp local.txt user@host:/remote/
scp -r dir/ user@host:/remote/
scp user@host:/remote/a.txt ./
```

### ssh

> 远程登录。

- 语法:`ssh [选项] 用户@主机`
- 常用选项:`-p` 端口 · `-i` 密钥
- 示例:

```bash
ssh root@192.168.1.10
ssh -p 2222 -i ~/.ssh/id_rsa user@host
```

### dig

> DNS 解析查询。

- 语法:`dig 域名`
- 示例:

```bash
dig www.baidu.com
```

## 8. 压缩与解压

### tar

> 打包 / 解包。

- 语法:`tar [选项] 文件`
- 常用选项:`-c` 创建 · `-x` 解包 · `-z` gzip · `-j` bzip2 · `-f` 文件 · `-v` 过程 · `-C` 指定目录
- 示例:

```bash
tar -czf backup.tar.gz dir/       # 压缩
tar -xzf backup.tar.gz            # 解压
tar -xzf backup.tar.gz -C /opt    # 解压到指定目录
```

### gzip

> 压缩为 .gz 文件。

- 语法:`gzip [选项] 文件`
- 常用选项:`-k` 保留原文件 · `-d` 解压
- 示例:

```bash
gzip file.txt
gzip -d file.txt.gz
```

### gunzip

> 解压 .gz 文件。

- 语法:`gunzip [选项] 文件`
- 常用选项:`-k` 保留原文件
- 示例:

```bash
gunzip file.gz
```

### zip

> 压缩为 zip。

- 语法:`zip [选项] 输出文件 输入`
- 常用选项:`-r` 递归
- 示例:

```bash
zip -r backup.zip dir/
```

### unzip

> 解压 zip。

- 语法:`unzip [选项] 文件`
- 示例:

```bash
unzip backup.zip
```

## 9. 用户与用户组

### useradd

> 添加用户。

- 语法:`useradd [选项] 用户名`
- 常用选项:`-m` 建主目录 · `-s` 指定 shell
- 示例:

```bash
useradd -m -s /bin/bash zhangsan
```

### usermod

> 修改用户。

- 语法:`usermod [选项] 用户名`
- 常用选项:`-aG` 追加到组
- 示例:

```bash
usermod -aG sudo zhangsan
```

### userdel

> 删除用户。

- 语法:`userdel [选项] 用户名`
- 常用选项:`-r` 连同主目录
- 示例:

```bash
userdel -r zhangsan
```

### passwd

> 设置 / 修改密码。

- 语法:`passwd [用户名]`
- 示例:

```bash
passwd
passwd zhangsan
```

### su

> 切换用户。

- 语法:`su [选项] [用户]`
- 常用选项:`-` 加载环境变量
- 示例:

```bash
su -
su - zhangsan
```

### sudo

> 以 root 权限执行命令。

- 语法:`sudo 命令`
- 示例:

```bash
sudo apt update
sudo systemctl restart nginx
```

## 10. 搜索与查找

### find

> 按条件查找文件。

- 语法:`find 路径 [条件]`
- 常用条件:`-name` 名称 · `-type` 类型 · `-size` 大小 · `-mtime` 修改时间 · `-exec` 执行命令

**示例**

**1. 按文件名查找**

```bash
find / -name "*.log"
```

- `find` 查找命令;`/` 从根目录开始,在整个系统里搜索
- `-name "*.log"` 只匹配以 `.log` 结尾的文件名,`*` 是通配符
- 作用:找出全盘所有 `.log` 日志文件
- 提示:全盘搜索较慢、易因权限报错,可改用 `find /var/log -name "*.log"` 缩小范围

**2. 按类型 + 大小查找**

```bash
find / -type f -size +100M
```

- `-type f`:`f` 表示普通文件(排除目录、链接等)
- `-size +100M`:文件大于 100M;`+` 表示大于、`-` 表示小于,大小单位可用 `k`、`M`、`G`
- 作用:找出全盘大于 100M 的普通文件,常用于排查磁盘被谁占满

**3. 查找并执行删除**

```bash
find /tmp -type f -empty -exec rm {} \;
```

- `/tmp`:只在 `/tmp` 目录下搜索
- `-empty`:只匹配空文件
- `-exec rm {} \;`:对找到的每个文件执行 `rm`;`{}` 代表找到的文件,`\;` 是命令结束标记
- 作用:删除 `/tmp` 下所有空文件,常用于清理临时目录
- 安全做法:不确定时先把 `-exec rm {} \;` 换成 `-print` 预览要删的文件,确认无误再删;等价写法 `find /tmp -type f -empty -delete`

### locate

> 快速定位文件(基于索引库)。

- 语法:`locate [选项] 名称`
- 常用选项:`-i` 忽略大小写
- 示例:

```bash
locate nginx.conf
```

### which

> 查找命令所在路径。

- 语法:`which 命令`
- 示例:

```bash
which python3
```

### whereis

> 查找二进制 / 源码 / 手册位置。

- 语法:`whereis 命令`
- 示例:

```bash
whereis nginx
```

## 11. 系统管理

### shutdown

> 关机 / 重启 / 定时关机。

- 语法:`shutdown [选项] [时间]`
- 常用选项:`-h` 关机 · `-r` 重启 · `-c` 取消定时
- 时间写法:`now` 立即 · `HH:MM` 指定时刻 · `+N` N 分钟后
- 示例:

```bash
shutdown -h now        # 立即关机
shutdown -r now        # 立即重启
shutdown -h 23:00      # 23:00 关机
shutdown -h +10        # 10 分钟后关机
shutdown -c            # 取消已计划的关机
```

### reboot

> 重启系统。

- 语法:`reboot [选项]`
- 常用选项:`-f` 强制重启(跳过正常关机流程)
- 示例:

```bash
reboot            # 正常重启
reboot -f         # 强制重启(慎用)
```

### poweroff

> 立即关机。

- 语法:`poweroff` / `systemctl poweroff [选项]`
- 常用选项:`-i` 忽略抑制器(其他登录用户 / 进程的阻止)
- 示例:

```bash
poweroff
systemctl poweroff          # systemd 方式关机
systemctl poweroff -i       # 忽略抑制器,强制关机
```

### halt

> 立即停止系统(关机)。

- 语法:`halt [选项]`
- 常用选项:`-p` 停止后断电
- 示例:

```bash
halt
halt -p
```

> 补充:老式 SysV 中 `init 0` = 关机、`init 6` = 重启;systemd 系统也可用 `systemctl poweroff` / `systemctl reboot`。

### crontab

> 设置定时任务。

- 语法:`crontab -e`(编辑)· `-l`(查看)· `-r`(删除)
- 格式:`分 时 日 月 周 命令`
- 示例:

```bash
0 2 * * * /opt/backup.sh   # 每天 2 点执行
```

### alias

> 设置命令别名。

- 语法:`alias 别名='命令'`
- 示例:

```bash
alias ll='ls -lah'      # 设置别名
unalias ll              # 取消别名
```

## 12. 编辑器

### vim

> 文本编辑器。

- 语法:`vim 文件`
- 模式切换:`i` / `a` / `o` 进入编辑 · `Esc` 回命令模式 · `:` 底行命令 · `v` 可视模式

- 移动光标(命令模式):

| 键 | 作用 |
|----|------|
| `h` / `j` / `k` / `l` | 左 / 下 / 上 / 右 |
| `w` / `b` | 下一个词 / 上一个词 |
| `0` / `$` | 行首 / 行尾 |
| `gg` / `G` | 文件开头 / 文件末尾 |
| `Ctrl+f` / `Ctrl+b` | 向下 / 向上翻页 |

- 编辑操作(命令模式):

| 键 | 作用 |
|----|------|
| `x` | 删除光标处字符 |
| `dw` | 删除一个词 |
| `dd` | 删除(剪切)整行 |
| `yy` | 复制整行 |
| `Nyy` | 复制 N 行 |
| `p` / `P` | 粘贴到光标后 / 前 |
| `u` | 撤销 |
| `Ctrl+r` | 重做 |

- 查找 / 替换 / 保存退出:

| 命令 | 作用 |
|------|------|
| `/关键词` | 向下搜索 |
| `n` / `N` | 下一个 / 上一个匹配 |
| `:%s/old/new/g` | 全文替换 |
| `:w` | 保存 |
| `:q` | 退出 |
| `:wq` / `:x` | 保存并退出 |
| `:q!` | 不保存强制退出 |

- 示例:

```bash
vim file.txt        # 打开 / 新建文件
vim +100 file.txt   # 打开并定位到第 100 行
```

## 13. 服务管理

> 用 `systemctl` 统一管理服务。查看状态用 `status`,启动/停止/重启/开机自启等动作见 [[#systemctl]]。

### 常用服务速查

| 服务名              | 作用                | 查看状态                                   |
| ---------------- | ----------------- | -------------------------------------- |
| NetworkManager   | 网络连接管理            | `sudo systemctl status NetworkManager` |
| ufw              | 防火墙               | `sudo ufw status`                      |
| sshd / ssh       | SSH 远程登录          | `sudo systemctl status sshd`           |
| httpd / apache2  | Apache Web 服务     | `sudo systemctl status httpd`          |
| nginx            | Nginx Web 服务      | `sudo systemctl status nginx`          |
| mysqld / mariadb | MySQL/MariaDB 数据库 | `sudo systemctl status mysqld`         |
| docker           | Docker 容器引擎       | `sudo systemctl status docker`         |
| crond / cron     | 定时任务              | `sudo systemctl status crond`          |
|                  |                   |                                        |

- 语法:`sudo systemctl 动作 服务名`
- 常用动作:`status` 查看状态 · `start` 启动 · `stop` 停止 · `restart` 重启 · `reload` 重载配置 · `enable` 开机自启 · `disable` 取消自启 · `is-active` 是否运行 · `is-enabled` 是否自启
- 示例:

```bash
# —— 网络服务 ——
sudo systemctl status NetworkManager      # 查看网络服务状态
sudo systemctl restart NetworkManager     # 重启网络服务
sudo systemctl enable NetworkManager      # 设置开机自启

# —— 防火墙(RHEL 系 firewalld / Debian 系 ufw)——
sudo systemctl status firewalld
sudo systemctl start firewalld            # 启动
sudo systemctl stop firewalld             # 停止
sudo systemctl disable firewalld          # 取消开机自启

sudo ufw status                           # 查看状态(ufw)
sudo ufw enable                           # 启用防火墙
sudo ufw disable                          # 禁用防火墙
sudo ufw allow 22                         # 放行 22 端口

# —— SSH ——
sudo systemctl status sshd
sudo systemctl restart sshd
sudo systemctl enable sshd

# —— Web / 数据库 / 容器 ——
sudo systemctl restart nginx
sudo systemctl restart httpd
sudo systemctl restart mysqld
sudo systemctl restart docker
```

> 提示:若 `status` 报 `Unit xxx.service could not be found`,通常是该服务未安装,或服务名因发行版而异(如 Ubuntu 用 `ufw` / `ssh` / `apache2` / `cron`,RHEL 系用 `firewalld` / `sshd` / `httpd` / `crond`)。可用 `systemctl list-unit-files --type=service | grep 关键词` 查实际服务名。

### 服务列表与自启

> 查看系统里有哪些服务、哪些在运行、哪些开机自启。

```bash
systemctl list-units --type=service        # 正在运行的服务
systemctl list-units --type=service --all  # 全部服务(含未运行)
systemctl list-unit-files --type=service   # 所有服务及开机自启情况
systemctl is-active sshd                   # 某服务是否正在运行
systemctl is-enabled sshd                  # 某服务是否开机自启
```

## 14. 软件包管理

### apt

> Debian / Ubuntu 系软件包管理工具。

- 语法:`sudo apt 动作 [包名]`
- 常用动作:

| 动作 | 作用 |
|------|------|
| `update` | 更新软件源索引 |
| `upgrade` | 升级所有可升级的软件 |
| `full-upgrade` | 升级(可处理依赖变更,更彻底) |
| `install 包名` | 安装软件 |
| `remove 包名` | 卸载(保留配置) |
| `purge 包名` | 卸载并删除配置 |
| `autoremove` | 清理不再需要的依赖 |
| `search 关键词` | 搜索软件 |
| `show 包名` | 查看软件详情 |
| `list --upgradable` | 列出可升级的软件 |

- 示例:

```bash
sudo apt update                 # 更新软件源
sudo apt upgrade                # 升级已安装软件
sudo apt install nginx          # 安装 nginx
sudo apt remove nginx           # 卸载 nginx(保留配置)
sudo apt purge nginx            # 卸载并删除配置
sudo apt autoremove             # 清理无用依赖
sudo apt search "web server"    # 搜索软件
sudo apt show nginx             # 查看 nginx 详情
```

> 注:`apt` 是 `apt-get` / `apt-cache` 的简化封装,日常使用更友好;脚本里仍建议用 `apt-get`。

## 15. Shell 脚本

### sh

> 用 sh 解释器执行 shell 脚本（几乎所有 Linux 都自带）。

- 语法:`sh [选项] 脚本 [参数]`
- 常用选项:`-n` 只检查语法不执行 · `-x` 逐行显示执行过程 · `-e` 出错即退出
- 示例:

```bash
sh script.sh
sh -n script.sh           # 只检查语法
sh -x script.sh           # 调试：打印每条命令
```

### bash

> 用 bash 解释器执行脚本（bash 兼容 sh，功能更丰富，是脚本常用解释器）。

- 语法:`bash [选项] 脚本`
- 常用选项:`-n` 语法检查 · `-x` 调试 · `-e` 出错退出 · `-c` 直接执行字符串
- 示例:

```bash
bash script.sh
bash -c 'echo hello'
bash -x script.sh
```

### source

> 在当前 shell 中执行脚本（不新建子进程，脚本里定义的变量/函数会保留到当前会话）。

- 语法:`source 脚本` 或 `. 脚本`
- 示例:

```bash
source ~/.bashrc
. /etc/profile
```

### 脚本直接执行

> 让脚本能直接 `./script.sh` 运行：首行加 shebang 指定解释器，再赋予可执行权限。

- 首行 shebang:`#!/bin/bash`（或 `#!/bin/sh`）
- 示例:

```bash
chmod +x script.sh        # 赋予可执行权限
./script.sh               # 直接运行
```

### 获取变量值

> 用 `$` 读取变量的值。

- 语法:`$变量名` 或 `${变量名}`
- 常用特殊变量:`$0` 脚本名 · `$1` 第1个参数 · `$#` 参数个数 · `$?` 上条命令退出码 · `$$` 当前进程 PID
- 示例:

```bash
echo $name
echo "${name}abc"       # 花括号界定变量名，避免歧义
echo "第一个参数: $1"
```
