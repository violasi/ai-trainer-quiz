#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE_DOCX = ROOT.parent / "第3部分-人工智能训练师_3级_理论知识复习题.docx"
JUDGE_ANSWER_FILE = ROOT.parent / "判断题.txt"
SINGLE_ANSWER_FILE = ROOT.parent / "单选题.txt"
MULTIPLE_ANSWER_FILE = ROOT.parent / "多选题.txt"
OUTPUT_JSON = ROOT / "questions.json"
OUTPUT_JS = ROOT / "questions.js"


def load_docx_text(path: Path) -> str:
    result = subprocess.run(
        ["textutil", "-convert", "txt", "-stdout", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.replace("\r", "")


def normalize_lines(text: str) -> list[str]:
    lines = [line.strip() for line in text.splitlines()]
    return [line for line in lines if line and line != "\x0c"]


def extract_section(lines: list[str], start_marker: str, end_marker: str | None) -> list[str]:
    start = next(i for i, line in enumerate(lines) if start_marker in line) + 1
    if end_marker is None:
        end = len(lines)
    else:
        end = next(i for i, line in enumerate(lines[start:], start) if end_marker in line)
    return lines[start:end]


def parse_questions(section_lines: list[str], question_type: str) -> list[dict]:
    questions: list[dict] = []
    current: dict | None = None
    current_option: str | None = None

    judgment_re = re.compile(r"^[（(].*[）)]\s*(\d+)\.\s*(.+)$")
    choice_re = re.compile(r"^(\d+)\.\s*(.+)$")
    option_re = re.compile(r"^[（(]([A-E])[）)]\s*(.+)$")

    for line in section_lines:
        if question_type == "judge":
            match = judgment_re.match(line)
            if match:
                current = {
                    "number": int(match.group(1)),
                    "type": "judge",
                    "question": match.group(2).strip(),
                    "options": [
                        {"key": "T", "text": "正确"},
                        {"key": "F", "text": "错误"},
                    ],
                }
                questions.append(current)
            elif current is not None:
                current["question"] = f"{current['question']} {line}".strip()
            continue

        option_match = option_re.match(line)
        if option_match and current is not None:
            key = option_match.group(1)
            text = option_match.group(2).strip()
            current["options"].append({"key": key, "text": text})
            current_option = key
            continue

        question_match = choice_re.match(line)
        if question_match:
            current = {
                "number": int(question_match.group(1)),
                "type": question_type,
                "question": question_match.group(2).strip(),
                "options": [],
            }
            questions.append(current)
            current_option = None
            continue

        if current is None:
            continue

        if current_option and current["options"]:
            current["options"][-1]["text"] = f"{current['options'][-1]['text']} {line}".strip()
        else:
            current["question"] = f"{current['question']} {line}".strip()

    return questions


def parse_delimited_answers(path: Path, question_type: str) -> dict[int, str] | dict[int, list[str]]:
    answers: dict[int, str] | dict[int, list[str]] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line:
            continue

        parts = line.split("|||")
        if len(parts) != 3:
            raise ValueError(f"Invalid answer line in {path.name}: {line}")

        number = int(parts[0].strip())
        answer_text = parts[2].strip()

        if question_type == "judge":
            normalized = answer_text.replace("正确", "对").replace("错误", "错")
            if normalized not in {"对", "错"}:
                raise ValueError(f"Invalid judge answer in {path.name}: {line}")
            answers[number] = "T" if normalized == "对" else "F"
            continue

        if question_type == "single":
            match = re.match(r"^([A-E])", answer_text)
            if not match:
                raise ValueError(f"Invalid single answer in {path.name}: {line}")
            answers[number] = match.group(1)
            continue

        letters = []
        for part in re.split(r"[、，,]", answer_text):
            chunk = part.strip()
            if not chunk:
                continue
            match = re.match(r"^([A-E])\b", chunk)
            if match:
                letters.append(match.group(1))
        if not letters:
            raise ValueError(f"Invalid multiple answer in {path.name}: {line}")
        answers[number] = letters

    return answers


def attach_answers(questions: list[dict], answers: dict[int, str] | dict[int, list[str]]) -> None:
    for question in questions:
        question["answer"] = answers[question["number"]]
        question["id"] = f"{question['type']}-{question['number']}"


def validate_question_set(questions: list[dict], answers: dict[int, str] | dict[int, list[str]], label: str) -> None:
    question_numbers = {question["number"] for question in questions}
    answer_numbers = set(answers.keys())

    missing_answers = sorted(question_numbers - answer_numbers)
    extra_answers = sorted(answer_numbers - question_numbers)

    if missing_answers or extra_answers:
        raise ValueError(
            f"{label} mismatch: missing_answers={missing_answers[:10]}, extra_answers={extra_answers[:10]}"
        )


def multiple_question_priority(question: dict) -> tuple[int, int]:
    answer_count = len(question["answer"])
    option_count = len(question["options"])

    if answer_count == option_count:
        priority = 0
    elif answer_count == 1:
        priority = 1
    elif answer_count == option_count - 1:
        priority = 2
    else:
        priority = 3

    return priority, question["number"]


def main() -> None:
    text = load_docx_text(SOURCE_DOCX)
    lines = normalize_lines(text)

    judge_section = extract_section(lines, "一、判断题", "单选题")
    single_section = extract_section(lines, "单选题", "多选题")
    multi_section = extract_section(lines, "多选题", None)

    judge_questions = parse_questions(judge_section, "judge")
    single_questions = parse_questions(single_section, "single")
    multi_questions = parse_questions(multi_section, "multiple")

    judge_answers = parse_delimited_answers(JUDGE_ANSWER_FILE, "judge")
    single_answers = parse_delimited_answers(SINGLE_ANSWER_FILE, "single")
    multi_answers = parse_delimited_answers(MULTIPLE_ANSWER_FILE, "multiple")

    validate_question_set(judge_questions, judge_answers, "judge")
    validate_question_set(single_questions, single_answers, "single")
    validate_question_set(multi_questions, multi_answers, "multiple")

    attach_answers(judge_questions, judge_answers)
    attach_answers(single_questions, single_answers)
    attach_answers(multi_questions, multi_answers)

    multi_questions.sort(key=multiple_question_priority)

    payload = {
        "meta": {
            "title": "人工智能训练师（三级）理论知识题库",
            "source": {
                "questions": SOURCE_DOCX.name,
                "answers": [
                    JUDGE_ANSWER_FILE.name,
                    SINGLE_ANSWER_FILE.name,
                    MULTIPLE_ANSWER_FILE.name,
                ],
            },
            "counts": {
                "judge": len(judge_questions),
                "single": len(single_questions),
                "multiple": len(multi_questions),
                "total": len(judge_questions) + len(single_questions) + len(multi_questions),
            },
        },
        "questions": judge_questions + single_questions + multi_questions,
    }

    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    OUTPUT_JS.write_text(
        "window.QUESTION_BANK = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT_JSON}")
    print(f"Wrote {OUTPUT_JS}")
    print(payload["meta"]["counts"])


if __name__ == "__main__":
    main()
