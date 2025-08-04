from src.helper import load_pdf, text_split_process, load_embeddings
from langchain_community.vectorstores import FAISS

# 1. تحميل بيانات الـ PDF
docs = load_pdf("data/")

# 2. تقطيع النصوص
chunks = text_split_process(docs)

# 3. تحميل نموذج التضمين (embeddings)
embeddings = load_embeddings()

# 4. بناء الفهرس باستخدام FAISS
faiss_index = FAISS.from_texts([chunk.page_content for chunk in chunks], embedding=embeddings)

# 5. حفظ الفهرس محلياً في مجلد faiss_index
faiss_index.save_local("faiss_index")

print("FAISS index saved successfully.")
