file_path = 'components/payroll/PayrollConsole.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the residual dark colors that weren't prefixed with dark:
content = content.replace('border-slate-850', 'border-slate-200')
content = content.replace('bg-slate-850', 'bg-slate-100')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully fixed residual dark colors")
