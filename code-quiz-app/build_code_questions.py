#!/usr/bin/env python3
"""从 question/answer 的 ipynb 文件中提取填空题和答案，生成 code_questions.js。"""

import json
import re
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
QUESTION_DIR = os.path.join(PARENT_DIR, 'question')
ANSWER_DIR = os.path.join(PARENT_DIR, 'answer')

QUESTION_IDS = [
    '1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5',
    '2.1.1', '2.1.2', '2.1.3', '2.1.4', '2.1.5',
    '2.2.1', '2.2.2', '2.2.3', '2.2.4', '2.2.5',
    '3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.2.5',
]

BLANK_PATTERN = re.compile(r'_{2,}')


def read_notebook(path):
    """读取 ipynb，返回 {cell_id: source} 和 cell 顺序列表。"""
    with open(path, 'r', encoding='utf-8') as f:
        nb = json.load(f)

    cells = {}
    cell_order = []
    for cell in nb.get('cells', []):
        if cell.get('cell_type') != 'code':
            continue
        cell_id = cell.get('id', '')
        source = ''.join(cell.get('source', []))
        if source.strip():
            cells[cell_id] = source
            cell_order.append(cell_id)

    return cells, cell_order


def normalize_ws(s):
    """将多个空格压缩为一个，用于模糊匹配。"""
    return re.sub(r' +', ' ', s)


def try_match(fragments, answer_line):
    """尝试用 fragments 匹配 answer_line，提取填空答案。"""
    n = len(fragments)
    answers = []
    pos = 0

    for i, frag in enumerate(fragments):
        if i == 0:
            if frag == '':
                continue
            idx = answer_line.find(frag)
            if idx < 0:
                # 尝试空格归一化匹配
                norm_al = normalize_ws(answer_line)
                norm_frag = normalize_ws(frag)
                idx = norm_al.find(norm_frag)
                if idx < 0:
                    return None
                # 计算原始行中的位置
                pos = idx + len(norm_frag)
                # 使用归一化后的行继续匹配
                answer_line = norm_al
                continue
            pos = idx + len(frag)
        else:
            if frag == '':
                blank = answer_line[pos:]
                answers.append(blank)
                pos = len(answer_line)
            else:
                # 先尝试精确匹配
                if i == n - 1:
                    idx = answer_line.rfind(frag, pos)
                else:
                    idx = answer_line.find(frag, pos)

                # 精确匹配失败，尝试空格归一化
                if idx < 0:
                    norm_al = normalize_ws(answer_line)
                    norm_frag = normalize_ws(frag)
                    if i == n - 1:
                        idx = norm_al.rfind(norm_frag, pos)
                    else:
                        idx = norm_al.find(norm_frag, pos)
                    if idx >= 0:
                        answer_line = norm_al
                        frag = norm_frag

                if idx < 0:
                    return None

                blank = answer_line[pos:idx]
                answers.append(blank)
                pos = idx + len(frag)

    if len(answers) != n - 1:
        return None

    if any(a.strip() == '' for a in answers):
        return None

    return answers


def try_match_strip_comment(fragments, answer_line):
    """去掉行尾注释后重试匹配。"""
    # 找到 question fragments 中的注释部分
    last_frag = fragments[-1]
    comment_idx = last_frag.find('#')
    if comment_idx < 0:
        return None

    # 去掉最后一个 fragment 的注释
    stripped_last = last_frag[:comment_idx].rstrip()
    new_fragments = fragments[:-1] + [stripped_last]

    # 答案行也去掉注释
    a_comment_idx = answer_line.find('#')
    if a_comment_idx >= 0:
        stripped_answer = answer_line[:a_comment_idx].rstrip()
    else:
        stripped_answer = answer_line.rstrip()

    return try_match(new_fragments, stripped_answer)


def extract_answers_for_line(question_line, answer_lines):
    """找出匹配的答案行并提取填空答案。"""
    fragments = BLANK_PATTERN.split(question_line)
    if len(fragments) <= 1:
        return None

    for answer_line in answer_lines:
        # 先尝试精确匹配
        result = try_match(fragments, answer_line)
        if result is not None:
            return result

    # 精确匹配全部失败，尝试去掉注释再匹配
    for answer_line in answer_lines:
        result = try_match_strip_comment(fragments, answer_line)
        if result is not None:
            return result

    return None


def process_question(qid):
    """处理一对 question/answer notebook。"""
    q_path = os.path.join(QUESTION_DIR, f'{qid}-素材', f'{qid}.ipynb')
    a_path = os.path.join(ANSWER_DIR, f'{qid}-素材', f'{qid}.ipynb')

    if not os.path.exists(q_path) or not os.path.exists(a_path):
        print(f'WARNING: 缺少文件 {qid}')
        return None

    q_cells, q_order = read_notebook(q_path)
    a_cells, _ = read_notebook(a_path)

    # 始终收集所有答案 cell 的行（解决答案拆分到不同 cell 的问题）
    all_answer_lines = []
    for a_source in a_cells.values():
        all_answer_lines.extend(a_source.split('\n'))

    cells = []
    for cell_id in q_order:
        q_source = q_cells[cell_id]

        if not BLANK_PATTERN.search(q_source):
            cells.append({'text': q_source, 'answers': []})
            continue

        q_lines = q_source.split('\n')
        all_answers = []
        warnings = []

        for q_line in q_lines:
            if not BLANK_PATTERN.search(q_line):
                continue
            line_answers = extract_answers_for_line(q_line, all_answer_lines)
            if line_answers:
                all_answers.extend(line_answers)
            else:
                num_blanks = len(BLANK_PATTERN.findall(q_line))
                all_answers.extend(['???'] * num_blanks)
                warnings.append(q_line.strip()[:80])

        for w in warnings:
            print(f'  WARNING [{qid}]: 未匹配行: {w}')

        cells.append({'text': q_source, 'answers': all_answers})

    return {'id': qid, 'cells': cells}


def main():
    questions = []
    total_blanks = 0

    for qid in QUESTION_IDS:
        print(f'处理 {qid} ...')
        result = process_question(qid)
        if result:
            blanks = sum(len(c['answers']) for c in result['cells'])
            total_blanks += blanks
            print(f'  -> {len(result["cells"])} 个代码块, {blanks} 个填空')
            questions.append(result)

    output = {
        'meta': {'total': len(questions), 'totalBlanks': total_blanks},
        'questions': questions,
    }

    out_path = os.path.join(BASE_DIR, 'code_questions.js')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('window.CODE_QUESTIONS = ')
        json.dump(output, f, ensure_ascii=False, indent=2)
        f.write(';\n')

    print(f'\n完成！生成 {out_path}')
    print(f'共 {len(questions)} 道题, {total_blanks} 个填空')

    unknown = sum(
        1
        for q in questions
        for c in q['cells']
        for a in c['answers']
        if a == '???'
    )
    if unknown:
        print(f'\n注意: 有 {unknown} 个填空未找到答案(标记为 ???)，需要手动补充')


if __name__ == '__main__':
    main()
