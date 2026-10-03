# -*- coding: utf-8 -*-
"""
Script to generate official RMUTS CS Thesis Word Documents (.docx)
for Chapter 1, Chapter 2, Chapter 3, and Consolidated Chapters 1-3.
Format adhering to: คู่มือการจัดทำปริญญานิพนธ์ สาขาวิชาวิทยาการคอมพิวเตอร์ มทร.สุวรรณภูมิ
"""

import os
import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

FONT_NAME = "TH SarabunPSK"
FONT_NAME_ENG = "TH SarabunPSK"

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets internal margins of a table cell in dxa (1 pt = 20 dxa)."""
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table):
    """Sets standard academic table borders (thin horizontal borders, clean look)."""
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
            f'  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
            f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/>'
            f'  <w:insideV w:val="none"/>'
            f'  <w:left w:val="none"/>'
            f'  <w:right w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr[0].append(borders)

def format_run(run, font_name=FONT_NAME, size_pt=16, bold=False, italic=False, color_rgb=(0, 0, 0)):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor(*color_rgb)
    # Ensure East Asian / Complex Script font is also set
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{font_name}" w:hAnsi="{font_name}" w:cs="{font_name}"/>')
        rPr.append(rFonts)
    else:
        rFonts.set(qn('w:ascii'), font_name)
        rFonts.set(qn('w:hAnsi'), font_name)
        rFonts.set(qn('w:cs'), font_name)

def setup_page_setup(section, is_first_page_of_doc=True):
    """Configures margins according to RMUTS manual:
    Top: 3.81 cm (1.5 in) [or 5.08 cm / 2 in if starting chapter]
    Bottom: 2.54 cm (1.0 in)
    Left: 3.81 cm (1.5 in)
    Right: 2.54 cm (1.0 in)
    """
    section.top_margin = Cm(3.81)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(3.81)
    section.right_margin = Cm(2.54)
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.different_first_page_header_footer = True

def add_chapter_heading(doc, chap_num_text, chap_title_text):
    """Chapter heading: 20pt bold centered. 1 blank line after."""
    # Top spacing for first page of chapter (simulate 5.08 cm / 2.0 in top margin)
    p_num = doc.add_paragraph()
    p_num.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_num.paragraph_format.space_before = Pt(36) # extra margin to reach 5.08 cm
    p_num.paragraph_format.space_after = Pt(4)
    p_num.paragraph_format.line_spacing = 1.15
    r_num = p_num.add_run(chap_num_text)
    format_run(r_num, size_pt=20, bold=True)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(18) # 1 blank line
    p_title.paragraph_format.line_spacing = 1.15
    r_title = p_title.add_run(chap_title_text)
    format_run(r_title, size_pt=20, bold=True)

def add_major_heading(doc, heading_text):
    """Major heading (e.g. 1.1 ความเป็นมา): 16pt bold left-aligned with 1 blank line before."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(heading_text)
    format_run(r, size_pt=16, bold=True)
    return p

def add_sub_heading(doc, heading_text, level=2):
    """Sub heading (e.g. 1.3.1 ขอบเขต...): 16pt bold with slight indent."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    if level == 2:
        p.paragraph_format.left_indent = Cm(0.5)
    elif level >= 3:
        p.paragraph_format.left_indent = Cm(1.0)
    r = p.add_run(heading_text)
    format_run(r, size_pt=16, bold=True)
    return p

def add_body_paragraph(doc, text, indent=True):
    """Body paragraph: 16pt normal, 1 cm first-line indent."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if indent:
        p.paragraph_format.first_line_indent = Cm(1.0)
    r = p.add_run(text)
    format_run(r, size_pt=16, bold=False)
    return p

def add_bullet_item(doc, text, level=1):
    """Bullet item: 16pt normal with appropriate indent."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.left_indent = Cm(0.5 * level + 0.5)
    p.paragraph_format.first_line_indent = Cm(-0.5)
    bullet_symbol = "• " if level == 1 else "- "
    r1 = p.add_run(bullet_symbol)
    format_run(r1, size_pt=16, bold=True)
    r2 = p.add_run(text)
    format_run(r2, size_pt=16, bold=False)
    return p

def add_table_title(doc, title_text):
    """Table title: Bold left-aligned, e.g. ตารางที่ 1-1 แผนการดำเนินงาน..."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(title_text)
    format_run(r, size_pt=16, bold=True)
    return p

def add_figure_caption(doc, caption_text):
    """Figure caption: Centered bold below figure."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(14)
    r = p.add_run(caption_text)
    format_run(r, size_pt=16, bold=True)
    return p

def add_code_or_ascii_box(doc, ascii_text):
    """Box for diagrams and ascii schemas."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.left_indent = Cm(0.5)
    r = p.add_run(ascii_text)
    format_run(r, font_name="Consolas", size_pt=9.5, bold=False, color_rgb=(20, 30, 60))
    # Border / shading
    pPr = p._element.get_or_add_pPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8F9FA"/>')
    pPr.append(shd)

print("Helper functions defined successfully.")
