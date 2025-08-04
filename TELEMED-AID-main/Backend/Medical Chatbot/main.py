from flask import Flask, request
from src.helper import load_embeddings, load_model
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
from src.prompt import *
import os
from flask_cors import CORS
from py_eureka_client import eureka_client
import time

load_dotenv()

# Load FAISS index locally
embeddings = load_embeddings()
faiss_index = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)

PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

MODEL_PATH = os.getenv("MODEL_PATH")
llm = load_model(MODEL_PATH)

qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=faiss_index.as_retriever(search_kwargs={"k": 1}),
    return_source_documents=True,
    chain_type_kwargs={"prompt": PROMPT}
)

app = Flask(__name__)
CORS(app)

@app.route("/chatbot/get", methods=["POST"])
def chatbot():
    data = request.get_json()
    input = data.get("msg", "")
    start_time = time.time()  # ← Start timer
    results = qa({"query": input})
    duration = time.time() - start_time  # ← End timer

    print(f"LLM Response Time: {duration:.2f} seconds")  # ← Print duration
    print("Response: ", results["result"])
    if results["result"] == "":
        return {"response": "Sorry, I don't understand that."}, 200
    return {"response": results["result"]}, 200

if __name__ == "__main__":
    app.run(debug=True)