import sys
from pathlib import Path

root_path = Path(__file__).parent.parent.parent
sys.path.insert(0, str(root_path))

import os
os.chdir(root_path)

from ai.inference.predict import predict
from PIL import Image
import io
from collections import defaultdict


def aggregate_predictions(results):
    scores = defaultdict(list)

    for r in results:
        scores[r["label"]].append(r["confidence"])

    avg_scores = {
        label: sum(vals) / len(vals)
        for label, vals in scores.items()
    }

    best_label = max(avg_scores, key=avg_scores.get)

    return {
        "label": best_label,
        "confidence": round(avg_scores[best_label], 2)
    }

class AIService:

    async def process_images(self, files, plant):
        results = []

        for file in files:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents)).convert('RGB')

            prediction = predict(image, plant)

            top1 = prediction["predictions"][0]

            results.append({
                "filename": file.filename,
                "plant": plant,
                "label": top1["label"],
                "confidence": top1["confidence"],
            })

        overall = aggregate_predictions(results)

        return {
            "images": results,
            "overall": overall
        }