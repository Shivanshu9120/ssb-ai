import os
from pypdf import PdfReader
import docx

class DocumentLoader:
    @staticmethod
    def load_pdf(file_path: str) -> list[dict]:
        """
        Reads a PDF file page by page. Returns: [{'text': str, 'page': int}]
        """
        pages = []
        try:
            reader = PdfReader(file_path)
            for idx, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and text.strip():
                    pages.append({
                        "text": text.strip(),
                        "page": idx + 1
                    })
        except Exception as e:
            print(f"Failed to parse PDF {file_path}: {str(e)}")
        return pages

    @staticmethod
    def load_docx(file_path: str) -> list[dict]:
        """
        Reads a Word Document (.docx). Treats entire document text under Page 1.
        """
        pages = []
        try:
            doc = docx.Document(file_path)
            paragraphs = [para.text.strip() for para in doc.paragraphs if para.text.strip()]
            text = "\n".join(paragraphs)
            if text:
                pages.append({
                    "text": text,
                    "page": 1
                })
        except Exception as e:
            print(f"Failed to parse DOCX {file_path}: {str(e)}")
        return pages

    @staticmethod
    def load_txt_or_md(file_path: str) -> list[dict]:
        """
        Reads Markdown (.md) or Text (.txt) files.
        """
        pages = []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
            if text.strip():
                pages.append({
                    "text": text.strip(),
                    "page": 1
                })
        except Exception as e:
            print(f"Failed to parse text file {file_path}: {str(e)}")
        return pages

    @classmethod
    def load_file(cls, file_path: str) -> list[dict]:
        """
        Central loader router by extension.
        """
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            return cls.load_pdf(file_path)
        elif ext == ".docx":
            return cls.load_docx(file_path)
        elif ext in [".txt", ".md"]:
            return cls.load_txt_or_md(file_path)
        else:
            print(f"Unsupported document format: {ext}")
            return []
