import os
import glob
import re

src_files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)

issues = []
for f in sorted(src_files):
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    for i, line in enumerate(lines):
        # find all tailwind class candidates in className="..." or className={`...`}
        # match tokens that look like bg-slate-900, bg-slate-950, border-slate-800, text-white, etc without dark:
        matches = re.finditer(r'(?<![a-zA-Z0-9:_-])(bg-slate-900[^\s"\'`]*|bg-slate-950[^\s"\'`]*|bg-slate-800[^\s"\'`]*|border-slate-800[^\s"\'`]*|border-slate-700[^\s"\'`]*|divide-slate-800[^\s"\'`]*|text-white(?!\s*dark)|bg-\[#070d18\])', line)
        for m in matches:
            val = m.group(1)
            # check if immediately preceded by dark:
            start = m.start()
            if start >= 5 and line[start-5:start] == 'dark:':
                continue
            if start >= 11 and line[start-11:start] == 'hover:dark:':
                continue
            issues.append((f, i+1, val, line.strip()))

print(f"Total occurrences without dark: prefix: {len(issues)}")
for iss in issues:
    print(f"{iss[0]}:{iss[1]} -> {iss[2]} | {iss[3][:110]}")
