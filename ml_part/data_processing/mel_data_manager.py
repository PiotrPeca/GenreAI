import os
import numpy as np
import librosa
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from tensorflow.image import resize

class MelDataManager:
    def __init__(
        self,
        data_folder,
        classes,
        cache_path="../Data/processed/melspec_cache.npz",
        target_shape=(150, 150),
        chunk_duration=4,
        overlap_duration=2,
    ):
        self.data_folder = data_folder
        self.classes = classes
        self.cache_path = cache_path
        self.target_shape = target_shape
        self.chunk_duration = chunk_duration
        self.overlap_duration = overlap_duration
        self.data = None
        self.labels = None

    def _preprocess(self):
        
        melspectrograms_list = []
        labels_list = []
        for class_number, class_name in enumerate(self.classes):
            class_folder = os.path.join(self.data_folder, class_name)
            print(f'Processing of class {class_name} data is ongoing')
            for filename in os.listdir(class_folder):
                if not filename.endswith('.wav'):
                    continue
                file_path = os.path.join(class_folder, filename)
                audio_data, sample_rate = librosa.load(file_path, sr=None)
                chunk_samples = int(sample_rate * self.chunk_duration)
                overlap_samples = int(sample_rate * self.overlap_duration)
                denom = max(chunk_samples - overlap_samples, 1)
                num_of_chunks = int(np.ceil(max(len(audio_data) - chunk_samples, 0) / denom)) + 1
                for i in range(num_of_chunks):
                    start = i * denom
                    end = start + chunk_samples
                    chunk = audio_data[start:end]
                    mel_spectrogram = librosa.feature.melspectrogram(y=chunk, sr=sample_rate)
                    mel_spectrogram = mel_spectrogram.astype(np.float32)
                    mel_spectrogram = resize(np.expand_dims(mel_spectrogram, axis=-1), self.target_shape)
                    melspectrograms_list.append(mel_spectrogram)
                    labels_list.append(class_number)
        return np.array(melspectrograms_list), np.array(labels_list)

    def load_or_build_cache(self):
        if os.path.exists(self.cache_path):
            packed = np.load(self.cache_path, allow_pickle=False)
            self.data, self.labels = packed["data"], packed["labels"]
            print(f"Loaded cached data from {self.cache_path}")
        else:
            self.data, self.labels = self._preprocess()
            os.makedirs(os.path.dirname(self.cache_path), exist_ok=True)
            np.savez_compressed(self.cache_path, data=self.data, labels=self.labels)
            print(f"Saved cache to {self.cache_path}")
        return self.data, self.labels

    def one_hot(self):
        from tensorflow.keras.utils import to_categorical
        
        if self.labels is None:
            raise ValueError("Brak labels — wywołaj najpierw load_or_build_cache()")
        self.labels = to_categorical(self.labels, num_classes=len(self.classes))
        return self.labels

    def split(self, test_size=0.2, random_state=42):
        if self.data is None or self.labels is None:
            raise ValueError("Brak danych — wywołaj najpierw load_or_build_cache()")
        return train_test_split(self.data, self.labels, test_size=test_size, random_state=random_state)

    def predict_file(self, audio_path, return_rgb=True):
        """
        Przetwarza dowolny plik audio na mel-spektrogramy zgodnie z parametrami klasy
        (chunk_duration, overlap_duration, target_shape). Przydatne do predykcji
        nowych piosenek spoza bazy.

        Args:
            audio_path: ścieżka do pliku audio (.wav/.mp3/.flac itp.)
            return_rgb: gdy True zwraca 3 kanały (do transfer learningu),
                        gdy False zwraca 1 kanał (grayscale)

        Returns:
            np.ndarray o kształcie (N_chunks, H, W, 3) lub (N_chunks, H, W, 1)
        """
        from tensorflow.image import resize

        audio_data, sample_rate = librosa.load(audio_path, sr=None)

        chunk_samples = int(sample_rate * self.chunk_duration)
        overlap_samples = int(sample_rate * self.overlap_duration)
        denom = max(chunk_samples - overlap_samples, 1)
        num_of_chunks = int(np.ceil(max(len(audio_data) - chunk_samples, 0) / denom)) + 1

        spectrograms = []
        for i in range(num_of_chunks):
            start = i * denom
            end = start + chunk_samples
            chunk = audio_data[start:end]

            mel = librosa.feature.melspectrogram(y=chunk, sr=sample_rate)
            mel = mel.astype(np.float32)
            mel = resize(np.expand_dims(mel, axis=-1), self.target_shape)
            spectrograms.append(mel)

        result = np.array(spectrograms)
        if return_rgb:
            result = np.repeat(result, 3, axis=-1)

        return result

    #W RAZIE CHECI UZYCIA DO POPRAWY
    # def plot_example(self, idx):
    #     if self.data is None or self.labels is None:
    #         raise ValueError("Brak danych — wywołaj najpierw load_or_build_cache()")
    #     x = self.data[idx]
    #     y = self.labels[idx]
    #     class_idx = int(np.argmax(y)) if np.ndim(y) > 0 and len(np.shape(y)) > 0 and np.size(y) > 1 else int(y)
    #     plt.imshow(x.squeeze(), aspect='auto')
    #     plt.title(f"Spektrogram nr {idx} (Etykieta: {class_idx})")
    #     plt.colorbar()
    #     plt.show()