import sys
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' # Turn off warnings

import numpy as np
import librosa
from tensorflow.image import resize
import tensorflow as tf

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'first_model.keras')

audio_file_path = sys.argv[1]

classes = ['blues', 'classical', 'country', 'disco', 'hiphop','jazz', 'metal', 'pop', 'reggae', 'rock']
first_model = tf.keras.models.load_model(model_path)

def preprocess_audio(file_path, target_shape=(150,150), chunk_duration=4, overlap_duration=2):
    melspectograms_list = []

    audio_data, sample_rate = librosa.load(file_path, sr=None)
    chunk_samples = int(sample_rate * chunk_duration)
    overlap_samples = int(sample_rate * overlap_duration)
    
    num_of_chunks = int(np.ceil((len(audio_data) - chunk_samples) / (chunk_samples -  overlap_samples))) + 1
    
    for i in range(num_of_chunks):
        start = i * (chunk_samples - overlap_samples)
        end = start + chunk_samples

        chunk = audio_data[start:end]

        mel_spectogram = librosa.feature.melspectrogram(y=chunk, sr=sample_rate)

        mel_spectogram = resize(np.expand_dims(mel_spectogram, axis=-1),target_shape)

        melspectograms_list.append(mel_spectogram)
                    
    return np.array(melspectograms_list)

mel_spectograms = preprocess_audio(audio_file_path)
predictions = first_model.predict(mel_spectograms, verbose=0)
avg_prediction = np.mean(predictions, axis=0)

predicted_genre = classes[np.argmax(avg_prediction)]

print(predicted_genre)
sys.stdout.flush()