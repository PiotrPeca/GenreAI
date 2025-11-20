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

The trained model is exported in `.h5` or `.pt` format and served through a REST API for integration with the web app.

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

### 🧩 Additional Tools
- **Git & GitHub**
- **PyCharm / VS Code**
- **Postman** – API testing and endpoint verification

---

💡 *The project integrates a Python-based machine learning model with a web application, allowing users to upload audio files and receive real-time genre classification results.*
