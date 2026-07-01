import re

file_path = 'components/payroll/PayrollConsole.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of ' dark:...' or 'dark:...' classes
# This matches 'dark:' followed by any characters that typically make up a tailwind class
new_content = re.sub(r'\s*dark:[\w\-\[\]#/:.]+', '', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully removed dark classes from PayrollConsole.tsx")
