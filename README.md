# GenreAI

## 🧰 Technologies Used

This project combines **machine learning** with a **web application** that allows users to upload an audio file and receive a predicted music genre.

---

### 🎵 Part 1: Machine Learning Model (Python)

The model for music genre classification was developed and trained using **Python** and several popular data science and audio analysis libraries:

- **Jupyter Notebook** 
- **NumPy**
- **Pandas**
- **Matplotlib**
- **TensorFlow / Keras**
- **Scikit-learn**
- **Librosa** – audio feature extraction (MFCC, chroma, mel-spectrogram, etc.)  
- **IPython** – audio input/output handling (recording, playback)

The trained model is exported in `.keras` format and served through a REST API for integration with the web app.

---

### 🌐 Part 2: Web Application

The web application enables users to interact with the model through a modern and responsive interface.

#### Backend
- **Node.js** – JavaScript runtime environment  
- **Express.js** – server-side framework for building REST APIs  
- **Fetch API** – handles communication between front-end and back-end

#### Frontend
- **HTML** – structure of the website
- **CSS** – visual aspect of the website
- **JavaScript** – functionality of the website (audio file upload)

---

## 🧠 Models & Training

The repository contains code for several deep learning architectures located in `ml_part/models_building/`.

**⚠️ Important:** Trained model files (`.keras`) are **not included** in this repository. You need to train a model locally before running the application.

### Available Architectures
- **CNN (Convolutional Neural Network)** – `CNN_1.ipynb`, `CNN_2.ipynb`
- **LSTM (Long Short-Term Memory)** – `lstm.ipynb`
- **Transfer Learning** – `transfer_learning.ipynb`

### How to Train
1.  Navigate to the `ml_part/models_building/` directory.
2.  Open the desired notebook.
3.  Run the cells to train the model.
4.  The model will be saved to `ml_part/models/`.
    *Ensure your `app/src/classifier.py` is configured to load the correct model file.*

### 🚀 GPU Training (Windows with WSL2)

To significantly speed up model training using NVIDIA GPU on Windows:

1.  **Follow the official TensorFlow GPU setup guide:**  
    [TensorFlow GPU Installation for Windows (WSL2)](https://www.tensorflow.org/install/pip?hl=pl#windows-wsl2)

2.  **Modify `requirements.txt`:**  
    Uncomment the line:
    ```text
    tensorflow[and-cuda]
    ```
    And comment out the regular `tensorflow` line.

3.  **Open VS Code via WSL:**  
    Launch your project folder through WSL in VS Code to ensure proper environment compatibility.

4.  **Enable GPU in notebooks:**  
    In each training notebook (`CNN_1.ipynb`, `CNN_2.ipynb`, etc.), find and uncomment the line marked as:
    ```python
    # GPU training
    ```

**For other operating systems (Linux, macOS):**  
Refer to the [official TensorFlow installation guide](https://www.tensorflow.org/install/pip?hl=pl) for platform-specific GPU setup instructions.

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **Python** (v3.10 or higher recommended)

### 2. Setup Python Environment
1.  Navigate to the project root directory.
2.  Create a virtual environment:
    ```bash
    python -m venv .venv
    ```
3.  Activate the virtual environment:
    - **Windows**: `.venv\Scripts\activate`
    - **macOS/Linux**: `source .venv/bin/activate`
4.  Install required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

### 3. Setup Node.js Application
1.  Navigate to the `app` directory:
    ```bash
    cd app
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### 4. Running the Application
1.  Start the server (from the `app` directory):
    ```bash
    npm run dev
    ```
    *(Note: If `npm run dev` is not configured, use `node src/server.js`)*
2.  Open your browser and visit: `http://localhost:3000`