import re
import json

def parse_questions(filename: str) -> None:
    with open(filename, 'r', encoding='utf-8') as file:
        content = file.read()

    # Удаляем теги источников, так как они мешают парсингу
    content = re.sub(r'`[^`]*`', '', content)

    # Разбиваем текст на блоки по номерам вопросов (например, "1. ", "2. ", "32.Кем")
    raw_blocks = re.split(r'\n(?=\d+\.)', content)

    questions_data = []

    for block in raw_blocks:
        block = block.strip()
        if not block or not re.match(r'^\d+\.', block):
            continue

        lines = [line.strip() for line in block.split('\n') if line.strip()]

        # Первая строка — это сам вопрос
        question_text = lines[0]
        question_text = re.sub(r'^\d+\.\s*', '', question_text).strip()

        options = []
        # Проходим по остальным строкам, исключая "Подсказка", ссылки на статьи и пометки о выборе вариантов
        for line in lines[1:]:
            if line.lower() == 'подсказка' or line.startswith('ст.'):
                continue
            if re.match(r'^Выберите \d+ варианта ответа\.?$', line, re.IGNORECASE):
                continue
            options.append(line)

        if options:
            questions_data.append({
                "question": question_text,
                "options": options,
                "correctIndex": 0  # ВНИМАНИЕ: Нужно будет вручную проставить правильные индексы в JSON
            })

    with open('questions.json', 'w', encoding='utf-8') as json_file:
        json.dump(questions_data, json_file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    parse_questions('raw_text.txt')
