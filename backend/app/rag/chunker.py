class TextChunker:
    @staticmethod
    def split_text(text: str, chunk_size: int = 800, chunk_overlap: int = 150) -> list[str]:
        """
        Splits raw text into chunks based on word count estimates to avoid breaking words mid-way.
        """
        if not text or not text.strip():
            return []

        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0

        # Estimate words overlap: 150 characters is ~25 words
        overlap_word_count = max(5, int(chunk_overlap / 6))

        for word in words:
            current_chunk.append(word)
            current_length += len(word) + 1  # adding space char size

            if current_length >= chunk_size:
                chunks.append(" ".join(current_chunk))
                # Create sliding window overlap
                if len(current_chunk) > overlap_word_count:
                    current_chunk = current_chunk[-overlap_word_count:]
                else:
                    current_chunk = current_chunk[-1:]
                current_length = sum(len(w) + 1 for w in current_chunk)

        if current_chunk:
            chunks.append(" ".join(current_chunk))

        return chunks
