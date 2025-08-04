import os
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import CTransformers
from langchain_huggingface import HuggingFaceEmbeddings

def load_pdf(data):
    # Load PDF
    loader = DirectoryLoader(data,
                             glob="*.pdf",
                             loader_cls=PyPDFLoader)
    docs = loader.load()
    return docs

def text_split_process(docs):
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=20)
    texts = text_splitter.split_documents(docs)
    print(len(texts))
    return texts

def load_model(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found at: {path}")
    # Load LLaMA 2 model
    return CTransformers(model=path,
                model_type="llama",
                config={"max_new_tokens": 384
                ,'temperature':0.8})


def load_embeddings():
    # Create embeddings and vector store
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return embeddings