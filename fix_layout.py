file_path = 'components/payroll/PayrollConsole.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Details Card layout
content = content.replace('flex-1 flex flex-col justify-around gap-3', 'space-y-4 mt-2')

# Fix Calendar Tracker layout
content = content.replace('flex-1 flex flex-col justify-around gap-4', 'space-y-6 mt-2')

# Improve list items padding in Details Card
content = content.replace('p-3 rounded bg-slate-100 border border-slate-200', 'p-5 rounded-xl bg-slate-100 border border-slate-200 shadow-sm')

# Improve text sizes in list items
content = content.replace('text-sm font-bold text-slate-600', 'text-base font-bold text-slate-700')
content = content.replace('text-base font-black text-slate-900', 'text-xl font-black text-slate-900')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully fixed UI layout")
