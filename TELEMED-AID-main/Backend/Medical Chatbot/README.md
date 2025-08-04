# AI-Retrieval Augumented Generative (RAG) Medical Chatbot using Llama2

This is the README file for the `Medical Chatbot` setup.

## How to Use
- Clone the repository.
- Create a `venv` environment using this command: 
    * On Windows: `python -m venv venv` then `.\venv\Scripts\activate`
- Install the required libiraries using the following command:
    * On Windows: `pip install -r requirements.txt`
- Create a .env file in the root directory and add your Pinecone credentials as follows:
    `PINECONE_API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
    `PINECONE_API_ENV = e.g. "us-east-1"`
    `MODEL_PATH = "LLM path in your computer/server"`
- Download the quantize model from the link provided in model folder & keep the model in the model directory:
    `## Download the Llama 2 Model: llama-2-7b-chat.ggmlv3.q4_0.bin`
    `## From the following link: https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGML/tree/main`
- `# run the following command:`
- `pip install langchain-huggingface`
- `pip install -U langchain-community`
- `pip install py-eureka-client`
- `pip install faiss-cpu`
- `# Finally run the following command:`
`python vectorstore.py`
`python main.py`
- open up localhost.
