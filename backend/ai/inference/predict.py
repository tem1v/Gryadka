import torch
import json
from PIL import Image
from torch import nn
from torchvision import transforms, models
import torch.nn.functional as F
import os

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

loaded_models = {}

base_transform =  transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],[0.229, 0.224, 0.225])
])

tta_transforms = [
    base_transform,
    transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=1.0),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],[0.229, 0.224, 0.225])
    ])
]

def load_model(plant: str):
    if plant in loaded_models:
        return loaded_models[plant]

    models_path = f'ai/models/{plant}/best_model.pth'
    classes_path = f'ai/models/{plant}/classes.json'

    with open(classes_path, 'r', encoding='utf-8') as f:
        classes = json.load(f)

    num_classes = len(classes)
    model = models.resnet18()
    model.fc = nn.Sequential(nn.Dropout(0.5), nn.Linear(model.fc.in_features, 256), nn.ReLU(), nn.Dropout(0.3), nn.Linear(256, num_classes))

    model.load_state_dict(torch.load(models_path, map_location=device))
    model.to(device)
    model.eval()

    loaded_models[plant] = (model, classes)
    return model, classes

def predict(image: Image.Image, plant: str):
    model, classes = load_model(plant)

    outputs_sum = torch.zeros(1, len(classes)).to(device)

    for t in tta_transforms:
        img = t(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(img)
            probs = F.softmax(outputs, dim=1)
            outputs_sum += probs

    probs = outputs_sum / len(tta_transforms)

    top3 = torch.topk(probs, 3, dim=1)

    results = []
    for i in range(3):
        idx = top3.indices[0][i].item()
        conf = top3.values[0][i].item() * 100

        results.append({
                "filename": image.format,
                "plant": plant,
                "label": classes[idx],
                "confidence": round(conf, 2)
        })

    return format_response(results)

def format_response(results):

    top1_conf = results[0]["confidence"]

    if top1_conf > 80:
        status = "high_confidence"
    elif top1_conf > 50:
        status = "medium_confidence"
    else:
        status = "low_confidence"

    return {
        "status": status,
        "predictions": results,
    }