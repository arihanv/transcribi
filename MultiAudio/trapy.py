import whisper
import subprocess
import json
import subprocess as sp
import ffmpeg
import numpy as np

class Trapy:
    def __init__(self):
        self.model = whisper.load_model("base")
        self.transcript = None
    
    def generate(self, path, verbose=False):
        self.transcript = self.model.transcribe(path, verbose=verbose, word_timestamps=True, fp16=False, language="en")
        return self.transcript
    
    def save(self, filename):
        if self.transcript is not None:
            json.dump(self.transcript, open(filename, 'w'))
            print("Transcript saved to {}".format(filename))
        else:
            raise Exception("No transcript to save")

    def get_transcript(self):
        return self.transcript

    def load_transcript(self, filename):
        with open(filename, 'r') as f:
            self.transcript = json.loads(f.read())
        return self.transcript
    
    def get_duration(self, file_path):
        command = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file_path]
        try:
            result = subprocess.check_output(command, universal_newlines=True)
            duration = float(result)
            return duration
        except subprocess.CalledProcessError:
            return None
    
    def format_transcript(self, transcript=None):
        if transcript is None:
            result = self.transcript
        else:
            result = transcript
        hard = []
        temp = []
        st_split = []
        print('Detected Language:', result['language'])
        for segment in result['segments']:
            words = segment['words']
            for word_idx, word in enumerate(words):
                if not temp:
                    st_split.append({'start': word['start']})
                    temp.append(word['word'].lstrip())  # Append word with leading spaces removed
                else:
                    temp.append(word['word'])
                if word['probability'] < 0.5:
                    hard.append(word_idx)  # Append index of the word in words to hard
                if word['word'][-1] in ['.', '?', '!']:
                    st_split[-1]['hard'] = hard
                    st_split[-1]['sentence'] = temp
                    st_split[-1]['end'] = word['end']
                    temp = []
                    hard = []
        return st_split

    
    def chunker(self, st_split, n):
        summary = []
        for i in range(0, len(st_split), n):
            summary.append({'start': st_split[i]['start'], 'hard': [], 'end': st_split[min(i+n-1, len(st_split)-1)]['end'], 'sentence': []})
            for g in range(0, min(3, len(st_split)-i)):
                summary[-1]['hard'].append(st_split[i+g]['hard'])
            summary[-1]['sentence'] = [st_split[j]['sentence'] for j in range(i, min(i+n, len(st_split)))]
        return summary
    
    def split_generate(self, path, dur=0.7, thr=0.017):
        src = path
        dur = float(dur)
        thr = int(float(thr) * 65535)
        tmprate = 16000
        len2 = dur * tmprate
        buflen = int(len2 * 2)
        oarr = np.arange(1, dtype='int16')
        command = (ffmpeg.input(src).output("pipe:", format="s16le", acodec="pcm_s16le", ar=str(tmprate), ac=1).run_async(pipe_stdout=True))
        tf, pos, opos, i = True, 0, 0, 1

        try:
            while tf:
                raw = command.stdout.read(buflen)
                if raw == b'':
                    tf = False
                    break

                arr = np.frombuffer(raw, dtype="int16")
                rng = np.concatenate([oarr, arr])
                mx = np.amax(rng)
                if mx <= thr:
                    trng = (rng <= thr) * 1
                    sm = np.sum(trng)
                    if sm >= len2:
                        apos = pos + dur * 0.5
                        output_file = f'splits/split-{i}.wav'
                        sp.run(["ffmpeg", "-i", src, "-ss", str(opos), "-to", str(apos), "-c", "copy", "-y", output_file], check=True)
                        opos = apos
                        i += 1

                pos += dur
                oarr = arr

            if pos > opos:
                apos = pos - dur * 0.5
                output_file = f'splits/split-{i}.wav'
                sp.run(["ffmpeg", "-i", src, "-ss", str(opos), "-to", str(apos), "-c", "copy", "-y", output_file], check=True)
                i += 1

        except sp.CalledProcessError as err:
            print(f"FFmpeg error: {err}")
        except OSError as err:
            print("OS error:", err)
        except ValueError:
            print("Could not convert data to an integer.")
        except BaseException as err:
            print(f"Unexpected {err}=, {type(err)}=")
