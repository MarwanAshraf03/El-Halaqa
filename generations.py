#!/usr/bin/python3
import json
import os
import pathlib as path

def generate_students_txt_file():
    files = os.listdir(path.Path.home() / 'storage' / 'documents' / 'El-Halaqa' / 'students')
    std_list = []
    for student in files:
        # if students.endswith('.txt'):
        with open(path.Path.home() / 'storage' / 'documents' / 'El-Halaqa' / 'students' / student, 'r') as f:
            content = json.load(f)
            std = f"الاسم بالعربية: {content['name_arb']}\nالاسم بالانجليزية: {content['name_eng']}\nتاريخ الميلاد: {content['bDate']}\nالمدرسة: {content['school']}\nالمراجعة: {content['overAllMem']}\nالحفظ الجديد: {content['newMem']}\n\n"
            std_list.append(std)

    with open(path.Path(__file__).parent / "students.txt", 'w') as f:
        f.writelines("".join(std_list))

if __name__ == "__main__":
    generate_students_txt_file()