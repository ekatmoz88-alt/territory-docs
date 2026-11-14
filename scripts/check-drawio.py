from pathlib import Path
import xml.etree.ElementTree as ET

diagram_dir = Path("docs/diagrams")
expected = {
    "system-architecture-components.drawio",
    "oracle-table-groups.drawio",
}
files = {path.name: path for path in diagram_dir.glob("*.drawio")}
if set(files) != expected:
    raise SystemExit(f"Expected Draw.io files {sorted(expected)}, found {sorted(files)}")

for name, path in sorted(files.items()):
    root = ET.parse(path).getroot()
    if root.tag != "mxfile":
        raise SystemExit(f"{name}: root element must be <mxfile>")

    cells = root.findall(".//mxCell")
    ids = [cell.get("id") for cell in cells if cell.get("id") is not None]
    if len(ids) != len(set(ids)):
        raise SystemExit(f"{name}: duplicate mxCell IDs found")

    id_set = set(ids)
    edges = [cell for cell in cells if cell.get("edge") == "1"]
    if not edges:
        raise SystemExit(f"{name}: no edges found")

    for edge in edges:
        for endpoint in ("source", "target"):
            value = edge.get(endpoint)
            if value not in id_set:
                raise SystemExit(f"{name}: edge {edge.get('id')} references missing {endpoint}={value!r}")

    print(f"PASS {name}: valid XML, {len(cells)} cells, {len(edges)} edges")

print("PASS all Draw.io source diagrams")
