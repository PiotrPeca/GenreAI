import sys
import os
import json
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import numpy as np
import tensorflow as tf

script_dir = os.path.dirname(os.path.abspath(__file__))
ml_part_dir = os.path.join(script_dir, '..', '..', 'ml_part')
sys.path.append(ml_part_dir)

from data_processing import MelDataManager

audio_file_path = sys.argv[1]
# You can choose the model that will classify the music here
model_path = os.path.join(ml_part_dir, 'models', 'CNN_1.keras')

classes = ['blues', 'classical', 'country', 'disco', 'hiphop','jazz', 'metal', 'pop', 'reggae', 'rock']
first_model = tf.keras.models.load_model(model_path)

mgr = MelDataManager(
    data_folder="",
    classes=classes,
    target_shape=(150, 150),
    chunk_duration=4,
    overlap_duration=2,
)

mel_spectograms = mgr.predict_file(audio_file_path, return_rgb=False)

predictions = first_model.predict(mel_spectograms, verbose=0)
avg_prediction = np.mean(predictions, axis=0)

# We take top 3 indices with the highest value
top3_idx = np.argsort(avg_prediction)[-3:][::-1]

top3 = [
    {
        "genre": classes[i],
        "probability": float(avg_prediction[i])
    }
    for i in top3_idx
]

print(json.dumps(top3))
sys.stdout.flush()