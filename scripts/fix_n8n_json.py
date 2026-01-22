import json
import pathlib
import re
import textwrap

path = pathlib.Path(r"app\n8n_h420_enrichment_workflow-2.json")
content = path.read_text(encoding="utf-8")

pattern = re.compile(r'textwrap\.dedent\("""\\\n(.*?)\n\s*"""\)', re.S)
content = re.sub(pattern, lambda m: json.dumps(textwrap.dedent(m.group(1))), content)
content = re.sub(r'\bTrue\b', 'true', content)
content = re.sub(r'\bFalse\b', 'false', content)
content = re.sub(r'\bNone\b', 'null', content)

path.write_text(content, encoding="utf-8")
