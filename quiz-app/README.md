# 本地刷题软件

## 功能

- 选择 `判断题`、`单选题`、`多选题`
- 普通刷题模式下按题型顺序刷一遍，不重复
- 做错自动进入错题库
- 切换到错题库模式后可重复练习错题
- 错题做对后自动移出错题库
- 进度和错题库保存在浏览器 `localStorage`

## 启动

1. 生成题库数据：

```bash
cd /Users/user/Documents/aigc/test/quiz-app
python3 build_question_bank.py
```

2. 直接打开：

```text
/Users/user/Documents/aigc/test/quiz-app/index.html
```

## 题库来源

- 题目来自 `../第3部分-人工智能训练师_3级_理论知识复习题.docx`
- 答案来自 `../判断题.txt`、`../单选题.txt`、`../多选题.txt`

当前脚本会生成：

- `300` 道判断题
- `300` 道单选题
- `300` 道多选题
- `questions.json` 与可直接被浏览器加载的 `questions.js`
