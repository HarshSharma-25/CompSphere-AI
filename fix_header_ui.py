file_path = 'app/app-content.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Breadcrumb Separators
content = content.replace("<span style={{ color: 'var(--text-muted)' }}>&gt;</span>", "<span style={{ color: 'var(--text-muted)', margin: '0 6px', fontWeight: 500 }}>/</span>")

# 2. Fix Search Bar styling (rounder, no border)
content = content.replace("background: 'var(--bg-gray)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>", "background: 'var(--bg-gray)', border: 'none', borderRadius: '24px' }}>")
content = content.replace("padding: '6px 12px'", "padding: '8px 16px'")

# 3. Fix Role Button
role_btn_old = """                  padding: '8px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  background: 'var(--bg-white)',"""
role_btn_new = """                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '24px',
                  background: 'var(--bg-gray)',"""
content = content.replace(role_btn_old, role_btn_new)

# 4. Fix Notification and Dark Mode buttons (circular, gray bg, no border)
icon_btn_old = "style={{ position: 'relative', background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer' }}"
icon_btn_new = "style={{ position: 'relative', background: 'var(--bg-gray)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}"
content = content.replace(icon_btn_old, icon_btn_new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully applied UI/UX improvements to header")
